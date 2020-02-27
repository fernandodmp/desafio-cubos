var express = require('express');

var logger = require('morgan');

var rulesRouter = require('./routes/rulesRouter');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/rules', rulesRouter);

module.exports = app;
