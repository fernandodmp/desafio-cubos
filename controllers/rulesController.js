const fs = require('fs');
const uuid = require('short-uuid');
const dateFormat = require('dateformat');
const { createDateSequence, getWeekDay } = require('./../utils/dateUtils');
const rulesValidator = require('./../validators/rulesValidators');

const rules = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/schedulingRules.json`)
);

exports.createRule = (req, res, next) => {
  const newId = uuid.generate();
  const newRule = Object.assign({ id: newId }, req.body);

  let conflict = false;
  rules.forEach(rule => {
    if (rulesValidator.timeConflict(rule, newRule)) {
      conflict = true;
    }
  });

  if (conflict) {
    return res.status(400).json({
      message:
        'The rule cannot be created due to conflicting time with other rules'
    });
  }

  rules.push(newRule);

  fs.writeFile(
    `${__dirname}/../data/schedulingRules.json`,
    JSON.stringify(rules),
    err => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Something went wrong, please try again later' });
      } else {
        return res.status(201).json({
          rule: newRule
        });
      }
    }
  );
};

exports.getAllRules = (req, res, next) => {
  return res.status(200).json({
    rules
  });
};

exports.getSingleRule = (req, res, next) => {
  const ruleIndex = rules.findIndex(el => el.id === req.params.id);
  if (ruleIndex === -1) {
    return res.status(404).json({ message: 'Rule not found' });
  }

  const rule = rules[ruleIndex];

  return res.status(200).json({ rule: rule });
};

exports.deleteRule = (req, res, next) => {
  const ruleIndex = rules.findIndex(el => el.id === req.params.id);

  if (ruleIndex === -1) {
    return res.status(404).json({ message: 'Rule not found' });
  }

  const removedRule = rules.splice(ruleIndex, 1);

  fs.writeFile(
    `${__dirname}/../data/schedulingRules.json`,
    JSON.stringify(rules),
    err => {
      if (err) {
        rules.push(removedRule);
        return res
          .status(500)
          .json({ message: 'Something went wrong, please try again later' });
      } else {
        return res.status(204).json({});
      }
    }
  );
};

exports.getAvailableTimes = (req, res, next) => {
  const dateSequence = createDateSequence(
    new Date(req.body.initialDate),
    new Date(req.body.finalDate)
  );

  dateSequence.forEach(date => {
    rules.forEach(rule => {
      if (
        rule.type === 'singleDay' &&
        date.day.getTime() === new Date(rule.date).getTime()
      ) {
        date.addInterval({ start: rule.start, end: rule.end });
      } else if (
        rule.type === 'weekly' &&
        rule.weekdays.includes(getWeekDay(date.day))
      ) {
        date.addInterval({ start: rule.start, end: rule.end });
      } else if (rule.type === 'daily') {
        date.addInterval({ start: rule.start, end: rule.end });
      }
    });

    date.day = dateFormat(date.day, 'dd-mm-yyyy');
  });

  res.status(200).json(dateSequence);
};
