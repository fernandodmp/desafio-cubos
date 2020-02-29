const timeRegex = '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$';

exports.BasicRuleSchema = {
  id: '/BasicRuls',
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['weekly', 'daily', 'singleDay']
    },
    start: { type: 'string', format: timeRegex },
    end: { type: 'string', pattern: timeRegex }
  },
  required: ['start', 'end']
};

exports.WeeklyRuleSchema = {
  id: '/WeeklyRule',
  type: 'object',
  properties: {
    weekdays: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ]
      }
    }
  },
  required: ['weekdays']
};

exports.SingleDayRuleSchema = {
  id: '/WeeklyRule',
  type: 'object',
  properties: {
    date: { type: 'string', format: 'date-time' }
  }
};
