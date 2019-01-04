const mongoose = require('mongoose'), Schema = mongoose.Schema;

const userSchema = Schema({
    name: String
});

module.exports = mongoose.model('User', userSchema);