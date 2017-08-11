require('dotenv').config({ silent: true })

const Bot = require('./bot')

console.log(process.env.ALERT_CHANNEL)

const bot = new Bot({
  token: process.env.SLACK_API_TOKEN,
  name: 'Street Cleaning Bot',
  alertChannel: process.env.ALERT_CHANNEL
})

bot.start()
