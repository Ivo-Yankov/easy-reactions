## easy-reactions - A mongoose plugin for adding functionality for custom reactions to your existing models.

You can use this plugin to easily add "likes", "dislikes", etc. to any model.

The module creates the following Reaction schema. The plugin adds a reference to this schema to every model it is applied to.
It also adds a `reactionsCount` field, which contains a key-value map of the aggregated count of every reaction type for the specific object.

```
const ReactionSchema = new Schema({
    type: {type: Schema.Types.String, required: true, enum: types},
    owner: {type: Schema.Types.ObjectId, required: true, ref: "User"}
}, {versionKey: false});
```

The Reaction object requires an Owner. This is usually the user that has reacted to something.
You can specify the owner model in the initialization phase. By default the "User" model name is assumed.

You can also specify what types of reactions you would want to use in your application. By default "like" is the only accepted reaction type.

### Installation
``npm install easy-reactions --save``

### Usage
The plugin needs to be initialised before it is used. To do that, create a `reactions-config.js` file. At this point you can specify what kind of:
```
    const ReactionsInit = require('easy-reactions');
    module.exports = ReactionsInit(

        // The first argument is required. You have to pass the mongoose object that is used in your application.
        require('mongoose'),

        // Optional. You can specify what types of reactions are allowed and the name of the owner model
        {
            types: ["like", "dislike", "whatever"],
            owner: "User"
        }
    );
```

Make sure to include it in your main application file after you have initialised the mongoose connection:
```
    mongoose.connect(mongoDB);
    ...
    require('./reactions-config');
```

Then apply it to your model:
```
    const mongoose = require('mongoose'), Schema = mongoose.Schema;
    const addReactions = require('../reactions-config').plugin;

    const itemSchema = Schema({
        name: String
    });

    itemSchema.plugin(addReactions);
    module.exports = mongoose.model('Item', itemSchema);
```

The following methods will be available for your model:
```
    item.addReaction(type, owner)
    item.removeReaction(type, owner)

    // This one allows only one reaction per owner. The same owner cannot have multiple types of reactions for the same object.
    // If you want to allow the same owner to apply different types of reactions for the same object use the other methods.
    item.toggleReaction(type, owner)
```


When fetching your reactable objects, the reactions will be automatically populated.

```
{
    reactionsCount: {
        "like": 2,
        "dislike": 0,
    },
    reactions: [
        {
            _id: "...",
            owner: "...",
            type: "like"
        },
        {
            _id: "...",
            owner: "...",
            type: "like"
        }
    ],
    _id: "...",
    ...
}
```
### Check out the [example app](example).