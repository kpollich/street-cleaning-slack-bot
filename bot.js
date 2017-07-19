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
              'Today is a street cleaning day'
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
  performAlert() {
    if (isStreetCleaningDay(new Date())) {
      // Send a message to the Lancaster channel that it's a street cleaning day + return
      // TODO: Handle error responses from Slack - this can be Promise chained
      this.bot.postMessageToChannel(
        'lancaster',
        '@channel - Today is a street cleaning day'
      )
    }
  }
}

/**
 * Returns true if the given date is a street cleaning day
 * @param {Date} date
 */
function isStreetCleaningDay(date) {
  const isWednesday = date.getDay === 3
  const isThursday = date.getDay === 4

  // If this is not a Wednesday or Thursday, it cannot be a street cleaning day
  if (!isWednesday && !isThursday) {
    return false
  }

  // Wrap the date with moment to make manipulating it more sane
  const momentDate = moment(date)

  // Is this the first Wednesday or Thursday of the month?
  const isFirstOfMonth =
    momentDate.day(-7).getMonth() === momentDate.getMonth() - 1

  // Is this the last Wednesday or Thursday of the month?
  const isLastOfMonth =
    momentDate.day(7).getMonth() === momentDate.getMonth() + 1

  return isFirstOfMonth || isLastOfMonth
}

module.exports = Bot
