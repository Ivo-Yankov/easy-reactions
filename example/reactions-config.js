const ReactionsInit = require('./../index');

module.exports = ReactionsInit(require('mongoose'), {
    owner: "User",
    types: ["like", "dislike", "love", "angry"]
});