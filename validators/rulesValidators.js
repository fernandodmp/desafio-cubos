const { Validator } = require('jsonschema');
const rulesSchemas = require('./../schemas/rulesSchemas');

const validator = new Validator();

exports.validateRule = (req, res, next) => {
  const errors = [];
  errors.push(
    ...validator.validate(req.body, rulesSchemas.BasicRuleSchema).errors
  );
  if (req.body.type === 'weekly') {
    errors.push(
      ...validator.validate(
        { weekdays: req.body.weekdays },
        rulesSchemas.WeeklyRuleSchema
      ).errors
    );
  } else if (req.body.type === 'singleDay') {
    errors.push(
      ...validator.validate(
        { date: req.body.date },
        rulesSchemas.SingleDayRuleSchema
      ).errors
    );
  }
  console.log(errors);
  if (errors.length > 0) {
    return res.status(400).json({ messages: errors.map(error => error.stack) });
  }
  next();
};
