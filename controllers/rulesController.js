const fs = require('fs');
const uuid = require('short-uuid');

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
  console.log(JSON.stringify(rules));
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
