const express = require('express');
const router = express.Router();

const Item = require('./models/Item');
const User = require('./models/User');

router.post('/toggle-reaction', (req, res, next) => {
    const {itemId, ownerId, reactionType} = req.body;
    User.findOne({_id: ownerId})
        .then(owner => {
            return Item.findOne({ _id: itemId })
                .then(item => {
                    return item.toggleReaction(reactionType, owner)
                })
                .then(i => {
                    res.send(i);
                });
        })
        .catch(e => next(e));
});

router.post('/add-reaction', (req, res, next) => {
    const {itemId, ownerId, reactionType} = req.body;
    User.findOne({_id: ownerId})
        .then(owner => {
            return Item.findOne({ _id: itemId })
                .then(item => {
                    return item.addReaction(reactionType, owner)
                })
                .then(i => {
                    res.send(i);
                });
        })
        .catch(e => next(e));

});

router.post('/remove-reaction', (req, res, next) => {
    const {itemId, ownerId, reactionType} = req.body;
    User.findOne({_id: ownerId})
        .then(owner => {
            return Item.findOne({ _id: itemId })
                .then(item => {
                    return item.removeReaction(reactionType, owner)
                })
                .then(i => {
                    res.send(i);
                });
        })
        .catch(e => next(e));

});

module.exports = router;