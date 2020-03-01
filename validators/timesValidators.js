const { Validator } = require('jsonschema');
const timesSchemas = require('./../schemas/timesSchemas');

const validator = new Validator();

exports.validateTimeInterval = (req, res, next) => {
  const errors = [];
  errors.push(
    ...validator.validate(req.query, timesSchemas.DateIntervalSchema).errors
  );

  if (errors.length > 0) {
    return res.status(400).json({ messages: errors.map(error => error.stack) });
  }

  next();
};
