const mongoose = require('mongoose'), Schema = mongoose.Schema;
const addReactions = require('../reactions-config').plugin;

const itemSchema = Schema({
    name: String
});

itemSchema.plugin(addReactions);

module.exports = mongoose.model('Item', itemSchema);