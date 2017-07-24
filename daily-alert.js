require('dotenv').config({ silent: true })

const Bot = require('./bot')

const bot = new Bot({
  token: process.env.SLACK_API_TOKEN,
  name: 'Street Cleaning Bot'
})

bot.performDailyAlert()


