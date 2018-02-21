const momentTimezone = require("moment-timezone");
const SlackBot = require("slackbots");

const { isStreetCleaningDay } = require("./utils");

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
    console.log("Starting bot");
    this.bot.on("message", message => {
      if (message.type !== "message") {
        return;
      }

      this.bot.getUserId("street-cleaning-bot").then(userId => {
        const isMention = message.text.includes(userId);

        if (isMention) {
          console.log("Bot received mention");
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
    console.log("Checking for street cleaning day");
    if (isStreetCleaningDay(new Date())) {
      return this.bot.postMessageToChannel(
        this.alertChannel,
        ":rotating_light: Today is a street cleaning day!!! :rotating_light:"
      );
    }

    return Promise.resolve();
  }
}

module.exports = Bot;
