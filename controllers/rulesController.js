const fs = require('fs');
const uuid = require('short-uuid');
const dateFormat = require('dateformat');

const rules = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/schedulingRules.json`)
);

exports.validateRule = (req, res, next) => {
  const types = ['singleDay', 'weekly', 'daily'];

  if (!req.body.type) {
    return res.status(400).json({
      message: 'Must inform the type'
    });
  }

  if (!req.body.start) {
    return res.status(400).json({
      message: 'Missing the starting time'
    });
  }

  if (!req.body.end) {
    return res.status(400).json({
      message: 'Missing the ending time'
    });
  }

  if (!types.includes(req.body.type)) {
    return res.status(400).json({
      message: 'Invalid type of rule'
    });
  }

  if (req.body.type === 'singleDay' && !req.body.date) {
    return res.status(400).json({
      message: 'Missing the rule date'
    });
  }

  if (req.body.type === 'weekly' && !req.body.weekdays) {
    return res.status(400).json({
      message: 'Missing the ending time'
    });
  }

  next();
};

exports.createRule = (req, res, next) => {
  const newId = uuid.generate();
  const newRule = Object.assign({ id: newId }, req.body);

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

  rules.splice(ruleIndex, 1);

  fs.writeFile(
    `${__dirname}/../data/schedulingRules.json`,
    JSON.stringify(rules),
    err => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Something went wrong, please try again later' });
      } else {
        return res.status(204).json({});
      }
    }
  );
};

const createDateSequence = (initialDate, finalDate) => {
  const dayInMs = 1000 * 60 * 60 * 24;
  const daysBetween = (finalDate.getTime() - initialDate.getTime()) / dayInMs;

  const dateSequence = [{ day: initialDate, intervals: [] }];

  for (i = 1; i < daysBetween; i++) {
    dateSequence.push({
      day: new Date(initialDate.getTime() + i * dayInMs),
      intervals: []
    });
  }

  dateSequence.push({ day: finalDate, intervals: [] });

  return dateSequence;
};

const convertDayOfTheWeek = day => {
  const daysOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  return daysOfTheWeek[day];
};

/* const formatDateDDMMYYYY = date => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}; */

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
        date.intervals.push({ start: rule.start, end: rule.end });
      } else if (
        rule.type === 'weekly' &&
        rule.weekdays.includes(convertDayOfTheWeek(date.day.getDay()))
      ) {
        date.intervals.push({ start: rule.start, end: rule.end });
      } else if (rule.type === 'daily') {
        date.intervals.push({ start: rule.start, end: rule.end });
      }
    });

    date.day = dateFormat(date.day, 'dd/mm/yyyy');
  });

  res.status(200).json({ days: dateSequence });
};
