class AvailableTime {
  constructor(day) {
    this.day = day;
    this.intervals = [];
  }

  addInterval(interval) {
    this.intervals.push(interval);
  }
}

// eslint-disable-next-line no-unused-vars
const formatDateDDMMYYYY = date => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const convertMsToDays = date => {
  const dayInMs = 1000 * 60 * 60 * 24;
  return date / dayInMs;
};

const convertDaysToMs = days => {
  const dayInMs = 1000 * 60 * 60 * 24;
  return days * dayInMs;
};

const calculateDaysBetween = (initialDate, finalDate) => {
  return convertMsToDays(finalDate.getTime() - initialDate.getTime());
};

const increasesNDays = (initialDate, days) => {
  return new Date(initialDate.getTime() + convertDaysToMs(days));
};

exports.createDateSequence = (initialDate, finalDate) => {
  const daysBetween = calculateDaysBetween(initialDate, finalDate);

  const dateSequence = [new AvailableTime(initialDate)];

  for (var i = 1; i < daysBetween; i++) {
    dateSequence.push(new AvailableTime(increasesNDays(initialDate, i)));
  }

  dateSequence.push(new AvailableTime(finalDate));

  return dateSequence;
};

exports.getWeekDay = day => {
  const dayIndex = day.getDay();
  const daysOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  return daysOfTheWeek[dayIndex];
};
