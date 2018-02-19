const moment = require("moment");

/**
 * Returns true if the given date is a street cleaning day
 * Street cleaning occurs on the first and third Wednesday and Thursday of each month
 *
 * @param {Date} date
 */
exports.isStreetCleaningDay = date => {
  const isWednesday = date.getDay() === 3;
  const isThursday = date.getDay() === 4;

  if (!isWednesday && !isThursday) {
    return false;
  }

  // Wrap the date with moment to make manipulating it more sane
  const momentDate = moment(date);

  // Have to make use of moment's `clone` method here to avoid mutability issues
  const isFirstOfMonth =
    momentDate.clone().subtract(1, "weeks").month() ===
    momentDate.clone().subtract(1, "months").month();

  const isThirdOfMonth =
    momentDate.clone().subtract(2, "weeks").month() === momentDate.month() &&
    momentDate.clone().add(1, "weeks").month() === momentDate.month();

  return isFirstOfMonth || isThirdOfMonth;
};
