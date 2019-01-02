const Item = require('./models/Item');
const User = require('./models/User');
const OtherUserModel = require('./models/OtherUserModel');
const Reaction = require('./reactions-config').model;

module.exports = () => {
    let items = [
        {name: "item 1"},
        {name: "item 2"},
        {name: "item 3"}
    ];

    let users = [
        {name: "John Doe 1"},
        {name: "John Doe 2"},
        {name: "John Doe 3"}
    ];

    Promise.all([
    //     Item.remove({}).exec().then(() => {
    //         console.log("items cleared");
    //     }),
    //     User.remove({}).exec().then(() => {
    //         console.log("users cleared");
    //     }),
    //     OtherUserModel.remove({}).exec().then(() => {
    //         console.log("users cleared");
    //     }),
    //     Reaction.remove({}).exec().then(() => {
    //         console.log("reactions cleared");
    //     })
    ])
        .then(data => {
            console.log("Database cleared.");
            Promise.all([
                Item.collection.insert(items),
                User.collection.insert(users),
                OtherUserModel.collection.insert(users),
            ])
                .then(data => {
                    console.log("Data seeding complete.");
                })
                .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
};