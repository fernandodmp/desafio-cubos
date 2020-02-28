exports.BasicRuleSchema = {
  id: '/BasicRuls',
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['weekly', 'daily', 'singleDay']
    },
    start: { type: 'string' },
    end: { type: 'string' }
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
