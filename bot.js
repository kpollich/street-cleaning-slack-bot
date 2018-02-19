const momentTimezone = require("moment-timezone");
const SlackBot = require("slackbots");

/**
 * Contains logic for interfacing with Slack via the bot user + SlackBots module
 */
class Bot {
  constructor({ token, name, alertChannel }) {
    this.alertChannel = alertChannel;

    this.bot = new SlackBot({ token, name });
  }

  /**
   * Starts the bot in "daemon" mode - wires up callbacks so the bot can monitor incoming messages
   */
  start() {
    this.bot.on("message", message => {
      if (message.type !== "message") {
        return;
      }

      this.bot.getUserId("street-cleaning-bot").then(userId => {
        const isMention = message.text.includes(userId);

        if (isMention) {
          if (isStreetCleaningDay(new Date())) {
            this.bot.postMessage(
              message.channel,
              ":rotating_light: Today is a street cleaning day!!! :rotating_light:"
            );
          } else {
            this.bot.postMessage(
              message.channel,
              "Today is not a street cleaning day"
            );
          }
        }
      });
    });
  }

  /**
   * Check if today is a street cleaning day, then alert the provided channel if needed.
   */
  alert() {
    if (isStreetCleaningDay(new Date())) {
      return this.bot.postMessageToChannel(
        this.alertChannel,
        ":rotating_light: Today is a street cleaning day!!! :rotating_light:"
      );
    }

    return Promise.resolve();
  }
}

/**
 * Returns true if the given date is a street cleaning day
 * Street cleaning occurs on the first and third Wednesday and Thursday of each month
 * @param {Date} date
 */
function isStreetCleaningDay(date) {
  const isWednesday = date.getDay() === 3;
  const isThursday = date.getDay() === 4;

  if (!isWednesday && !isThursday) {
    return false;
  }

  // Wrap the date with moment to make manipulating it more sane
  const momentDate = momentTimezone(date).tz("America/New_York");

  // Have to make use of moment's `clone` method here to avoid mutability issues
  const isFirstOfMonth =
    momentDate.clone().subtract(1, "weeks").month() ===
    momentDate.clone().subtract(1, "months");

  const isThirdOfMonth =
    momentDate.clone().subtract(2, "weeks").month() === momentDate.month() &&
    momentDate.clone().add(1, "weeks").month() === momentDate.month();

  return isFirstOfMonth || isThirdOfMonth;
}

module.exports = Bot;
