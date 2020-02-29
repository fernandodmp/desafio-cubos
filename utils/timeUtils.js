const createDateObject = time => {
  const currentDate = new Date();

  const timeSplit = time.split(':');

  time = new Date(currentDate.getTime());
  time.setHours(timeSplit[0]);
  time.setMinutes(timeSplit[1]);
  return time;
};

exports.startGreaterThanEnd = (startTime, endTime) => {
  const startDate = createDateObject(startTime);
  const endDate = createDateObject(endTime);

  return startDate > endDate;
};

exports.checkTimeConlict = (
  firstStartTime,
  firstEndTime,
  secondStartTime,
  secondEndTime
) => {
  const firstStartDate = createDateObject(firstStartTime);
  const firstEndDate = createDateObject(firstEndTime);
  const secondStartDate = createDateObject(secondStartTime);
  const secondEndDate = createDateObject(secondEndTime);
  return firstStartDate <= secondEndDate && firstEndDate >= secondStartDate;
};
