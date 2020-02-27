const fs = require('fs');
const uuid = require('shord-uuid');

const rules = JSON.parse(fs.readFileSync('./../data/schedulingRules.json'));

exports.checkBody = (req, res, next) => {
  const types = ['singleDay', 'weekly', 'daily'];

  if (!req.body.type) {
    return res.status(400).json({
      message: 'Must inform the type'
    });
  }

  if (!req.body.intervalStart) {
    return res.status(400).json({
      message: 'Missing the starting time'
    });
  }

  if (!req.body.intervalEnd) {
    return res.status(400).json({
      message: 'Missing the ending time'
    });
  }

  if (!req.body.type in types) {
    return res.status(400).json({
      message: 'Invalid type of rule'
    });
  }

  if (req.body.type === 'weekly' && !req.body.weekdays) {
    return res.status(400).json({
      message: 'Missing the ending time'
    });
  }
  next();
};

exports.createRule = async (req, res, next) => {
  const newId = uuid.generate();
  const newRule = Object.assign({ id: newId }, req.body);

  rules.push();
  try {
    await fs.writeFile('./../data/schedulingRules.json', JSON.stringify(rules));
    res.status(201).json({
      rule: newRule
    });
  } catch {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
