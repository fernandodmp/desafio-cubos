exports.DateIntervalSchema = {
  id: '/DateIntervalRule',
  type: 'object',
  properties: {
    initialDate: { type: 'string', format: 'date-time' },
    finalDate: { type: 'string', format: 'date-time' }
  }
};
