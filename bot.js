const moment = require('moment')
const SlackBot = require('slackbots')

/**
 * Contains logic for interfacing with Slack via the bot user + SlackBots module
 */
class Bot {
  constructor({ token, name }) {
    this.token = token
    this.name = name

    this.bot = new SlackBot({
      token: process.env.SLACK_API_TOKEN,
      name: 'Street Cleaning Bot'
    })
  }

  /**
   * Starts the bot in "daemon" mode - wires up callbacks so the bot can monitor incoming messages
   */
  start() {
    this.bot.on('message', message => {
      if (message.type !== 'message') {
        return
      }

      this.bot.getUserId('street-cleaning-bot').then(userId => {
        const isMention = message.text.includes(userId)

        if (isMention) {
          if (isStreetCleaningDay(new Date())) {
            this.bot.postMessage(
              message.channel,
              ':rotating_light: Today is a street cleaning day!!! :rotating_light:'
            )
          } else {
            this.bot.postMessage(
              message.channel,
              'Today is not a street cleaning day'
            )
          }
        }
      })
    })
  }

  /**
   * Check if today is a street cleaning day, then alert the #lancaster channel in Slack.
   * If today is not a street cleaning day, does nothing.
   */
  performDailyAlert() {
    if (isStreetCleaningDay(new Date())) {
      // Send a message to the Lancaster channel that it's a street cleaning day + return
      // TODO: Handle error responses from Slack - this can be Promise chained
      return this.bot.postMessageToChannel(
        'lancaster',
        '@channel - :rotating_light: Today is a street cleaning day!!! :rotating_light:'
      )
    }

    return Promise.resolve()
  }
}

/**
 * Returns true if the given date is a street cleaning day
 * Street cleaning occurs on the first and third Wednesday and Thursday of each month
 * @param {Date} date
 */
function isStreetCleaningDay(date) {
  const isWednesday = date.getDay() === 3
  const isThursday = date.getDay() === 4

  if (!isWednesday && !isThursday) {
    return false
  }

  // Wrap the date with moment to make manipulating it more sane
  const momentDate = moment(date)

  const isFirstOfMonth = momentDate.day(-7).month() === momentDate.month() - 1

  const isThirdOfMonth =
    momentDate.day(-14).month() === momentDate.month() &&
    momentDate.day(7).month() === momentDate.month()

  return isFirstOfMonth || isThirdOfMonth
}

module.exports = Bot
