const { Validator } = require('jsonschema');
const rulesSchemas = require('./../schemas/rulesSchemas');
const { getWeekDay } = require('./../utils/dateUtils');
const {
  checkTimeConlict,
  startGreaterThanEnd
} = require('./../utils/timeUtils');

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
  if (errors.length > 0) {
    return res.status(400).json({ messages: errors.map(error => error.stack) });
  }

  if (startGreaterThanEnd(req.body.start, req.body.end)) {
    return res
      .status(400)
      .json({ messages: 'The start time cannot be greater than the end time' });
  }
  next();
};

exports.timeConflict = (rule, newRule) => {
  if (newRule.type === 'daily' || rule.type === 'daily') {
    return checkTimeConlict(rule.start, rule.end, newRule.start, newRule.end);
  }

  if (newRule.type === 'weekly' && rule.type === 'singleDay') {
    if (newRule.weekdays.includes(getWeekDay(new Date(rule.date)))) {
      return checkTimeConlict(rule.start, rule.end, newRule.start, newRule.end);
    } else {
      return false;
    }
  }

  if (rule.type === 'weekly' && newRule.type === 'singleDay') {
    if (rule.weekdays.includes(getWeekDay(new Date(newRule.date)))) {
      return checkTimeConlict(rule.start, rule.end, newRule.start, newRule.end);
    } else {
      return false;
    }
  }

  if (newRule.type === 'singleDay' && rule.type === 'singleDay') {
    if (new Date(newRule.date).getTime() === new Date(rule.date).getTime()) {
      return checkTimeConlict(rule.start, rule.end, newRule.start, newRule.end);
    } else {
      return false;
    }
  }

  if (newRule.type === 'weekly' && rule.type === 'weekly') {
    const commonWeekDays = newRule.weekdays.filter(weekday =>
      rule.weekdays.includes(weekday)
    );
    if (commonWeekDays.length > 0) {
      return checkTimeConlict(rule.start, rule.end, newRule.start, newRule.end);
    } else {
      return false;
    }
  }
};
