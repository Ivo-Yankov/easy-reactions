process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Item = require('../models/Item');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Items', () => {
    beforeEach((done) => { //Before each test we empty the database
        Item.remove({}, (err) => {
            done();
        });
    });

    /*
     * Test the /GET route
     */
    describe('/GET items', () => {
        it('it should GET all the items, there shouldn\'t be any', (done) => {
            chai.request(server)
                .get('/items/all')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });


    describe('/POST item', () => {
        it('it should not POST a book without pages field', (done) => {
            let item = {
                "name": "Item4e",
                "color": "red"
            };

            chai.request(server)
                .post('/items')
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name').eql('Item4e');
                    res.body.should.have.property('color').eql('red');
                    done();
                });
        });

    });

    /*
     * Test the /GET/:id route
     */
    describe('/GET items/:id', () => {
        it('it should GET an item by the given id', (done) => {
            let item = new Item({name: "test item", color: "blue"});
            item.save((err, item) => {
                chai.request(server)
                    .get('/items/single/' + item.id)
                    .send(item)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name').eql(item.name);
                        res.body.should.have.property('color').eql(item.color);
                        res.body.should.have.property('_id').eql(item.id);
                        done();
                    });
            });
        });
    });

    describe('PUT items/:id', () => {
        it('it should UPDATE an item by the given id', (done) => {
            let item = new Item({name: "item to be updated", color: "purple"});
            let itemUpdated = {name: "item to be updated - done", color: "green"};
            item.save((err, item) => {
                chai.request(server)
                    .put('/items/' + item.id)
                    .send(itemUpdated)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name').eql(itemUpdated.name);
                        res.body.should.have.property('color').eql(itemUpdated.color);
                        res.body.should.have.property('_id').eql(item.id);
                    });


                //check if data was really updated
                chai.request(server)
                    .get('/items/single/' + item.id)
                    .send(item)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name').eql(itemUpdated.name);
                        res.body.should.have.property('color').eql(itemUpdated.color);
                        res.body.should.have.property('_id').eql(item.id);
                        done();
                    });
            });
        });
    });

    describe('DELETE items/:id', () => {
        it('it should DELETE an item by the given id', (done) => {
            let item = new Item({name: "item to be deleted", color: "purple"});

            item.save((err, item) => {
                chai.request(server)
                    .delete('/items/' + item.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('n').eql(1);
                        res.body.should.have.property('ok').eql(1);
                        done();
                    });
            });
        });
    });

    /*
     * Test the /GET route
     */
    describe('/GET items', () => {
        it('it should GET all the items, there shouldn\'t be some', (done) => {
            let item1 = new Item({name: "item 1", color: "purple"});
            let item2 = new Item({name: "item 2", color: "purple"});
            let item3 = new Item({name: "item 3", color: "purple"});

            item1.save((err, item) => {
                item2.save((err, item) => {
                    item2.save();

                    item3.save((err, item) => {
                        chai.request(server)
                            .get('/items/all')
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('array');

                                for ( let i = 0; i < res.body.length; i++ ) {
                                    let item = res.body[i];
                                    item.should.be.a('object');
                                    item.should.have.property('name');
                                    item.should.have.property('color');
                                    item.should.have.property('_id');
                                }

                                res.body.length.should.be.eql(3);
                                done();
                            });
                    });

                });
            });
        });
    });
});