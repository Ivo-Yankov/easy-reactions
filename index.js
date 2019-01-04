const init = (mongoose, args = {}) => {
    const Schema = mongoose.Schema;

    const types = args.types || ["like"];
    const ownerModelName = args.owner || "User";

    const populateOptions = {
        path: "reactions"
    };

    const ReactionSchema = new Schema({
        type: {type: Schema.Types.String, required: true, enum: types},
        owner: {type: Schema.Types.ObjectId, required: true, ref: ownerModelName}
    }, {versionKey: false});

    const Reaction = mongoose.model('Reaction', ReactionSchema);

    /**
     * Counts the reactions for the given document and saves the result in reactionsCount
     *
     * @param doc
     * @returns {*}
     */
    const countReactionTypes = function (doc) {
        doc.reactionsCount = {};

        for (let i = 0; i < types.length; i++) {
            let type = types[i];
            doc.reactionsCount[type] = doc.reactions.filter(r => r.owner && r.type === type).length
        }

        return doc;
    };

    /**
     * Auto population plugin
     * @param next
     */
    const autoPopulateReactions = function (next) {
        this.populate(populateOptions);
        next();
    };

    /**
     * Plugin for enabling a reaction functionality to a schema.
     * There are 2 reaction types: like, dislike
     * The data is autopopulated and a count for every reaction type is saved in the document
     *
     * @param schema
     * @param options
     */
    const plugin = (schema, options) => {
        let reactionsCount = {};
        for (let i = 0; i < types.length; i++) {
            let type = types[i];
            reactionsCount[type] = {type: Number, default: 0};
        }

        schema.add({
            reactions: [{type: Schema.Types.ObjectId, ref: "Reaction", default: []}],
            reactionsCount
        });

        schema.post('init', countReactionTypes);

        schema
            .pre('findOne', autoPopulateReactions)
            .pre('find', autoPopulateReactions);

        schema.methods.addReaction = function (reactionType, owner) {
            let newReaction = new Reaction({
                owner: owner._id,
                type: reactionType
            });

            return newReaction.save()
                .then(() => {
                    this.reactions = this.reactions.concat([newReaction]);
                    return this.save()
                        .then(() => {
                            return countReactionTypes(this);
                        })
                });
        };

        schema.methods.removeReaction = function (reactionType, owner) {
            for (let i = 0; i < this.reactions.length; i++) {
                let r = this.reactions[i];
                if (r.owner && r.owner._id.toString() === owner._id.toString() && r.type === reactionType) {
                    this.reactions.pull({_id: r._id});
                    Reaction.deleteMany({_id: r._id}).exec();
                    return this.save().then(() => {
                        return countReactionTypes(this);
                    });
                }
            }

            return this;
        };

        schema.methods.toggleReaction = function (reactionType, owner) {
            for (let i = 0; i < this.reactions.length; i++) {
                let r = this.reactions[i];
                if (r.owner && r.owner._id.toString() === owner._id.toString()) {
                    this.reactions.pull({_id: r._id});
                    Reaction.deleteMany({_id: r._id}).exec();

                    if (r.type !== reactionType) {
                        break;
                    } else {
                        return this.save().then(() => {
                            return countReactionTypes(this);
                        });
                    }

                }
            }

            let newReaction = new Reaction({
                owner: owner._id,
                type: reactionType
            });

            return newReaction.save()
                .then(() => {
                    this.reactions = this.reactions.concat([newReaction]);
                    return this.save()
                        .then(() => {
                            return countReactionTypes(this);
                        })
                });
        };
    };

    return {
        model: Reaction,
        plugin
    }
};

module.exports = init;