require('dotenv').config({ silent: true })

const moment = require('moment')
const SlackBot = require('slackbots')

const bot = new SlackBot({
  token: process.env.SLACK_API_TOKEN,
  name: 'Street Cleaning Bot'
})

const botUserId = bot.getUserId('street-cleaning-bot')

bot.on('start', () => {
  bot.postMessageToUser('kyle', 'Bot start')
})

bot.on('message', message => {
  // Ignore everything that's not an actual message
  if (message.type !== 'message') {
    return
  }

  // Continue as long as the message isn't from another bot - bots don't care about street cleaning
  if (!message.bot_id) {
    console.log(message)

    if (message.text.includes('street cleaning')) {
      if (isStreetCleaningDay(new Date())) {
        bot.postMessage(
          message.channel,
          'It is street cleaning day! Park away from the great street vacuum'
        )
      } else {
        bot.postMessage(
          message.channel,
          'No street cleaning today - stay safe on those dirty streets'
        )
      }
    }
  }
})

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
