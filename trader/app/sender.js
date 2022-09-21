const TelegramBot = require('node-telegram-bot-api')


const chatId = -1001548891189
const token = '5431876460:AAE0e5UkdOHn4YuAOf0_1oRIUCexfsv0xXE'

const bot = new TelegramBot(token, {polling: false})

const sendTelegramMessage = (message) => {
    console.log(message)
    bot.sendMessage(chatId, message)
}

module.exports = {
    sendTelegramMessage
}
