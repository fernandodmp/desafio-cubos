const express = require('express');

const logger = require('morgan');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const rulesRouter = require('./routes/rulesRouter');
const timesRouter = require('./routes/timesRouter');

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15 // limit each IP to 15 requests per windowMs
});
app.use(limiter);
app.use(helmet());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/rules', rulesRouter);
app.use('/api/v1/times', timesRouter);

module.exports = app;
