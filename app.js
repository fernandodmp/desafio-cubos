const express = require('express');

const logger = require('morgan');

const rulesRouter = require('./routes/rulesRouter');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/rules', rulesRouter);

module.exports = app;
