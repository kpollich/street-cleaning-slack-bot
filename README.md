# Street Cleaning Slack Bot

A Slack Bot for keeping track of street cleaning days in Lancaster so you can avoid parking tickets.

## Usage

The bot expects a `SLACK_API_TOKEN` environment variable to be defined. You can define this variable in a `.env` file. You'll need to create a Slack "Bot" user and use the provided token to authenticate. See Slack's [documentation](https://api.slack.com/bot-users) for more information.

For now, the bot's user name is hard coded to `street-cleaning-bot`, but this may be moved to an environment variable at a later date.

The bot performs two functions: responding to mentions and a sending alert messages on street cleaning days.

### Sample Crontab Entry for Alerts

To run every Wednesday and Thursday at 7:30 AM, use the following `crontab` entry:

```
30 7 * * 3,4 cd /path/to/street-cleaning-slack-bot && yarn alert
```