const ReactionsInit = require('./../index');

module.exports = ReactionsInit(require('mongoose'), {
    owner: "OtherUserModel",
    types: ["love", "hate", "clap"]
});