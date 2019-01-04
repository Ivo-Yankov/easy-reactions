const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let mongoDB = 'mongodb://localhost:27017/easy-reactions-example';

mongoose.connect(mongoDB, { useNewUrlParser: true });
require('./reactions-config');
require('./seedData')();

app.set('view engine', 'jade');
app.use(bodyParser.json());

const routes = require('./routes');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err);
});

module.exports = app;
