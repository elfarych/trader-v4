const axios = require('axios')
const config = require('./config')
const telegramBot = require('./sender')
const Trader = require('./Trader')

let coins = []
const inTradeCoins = []

function getCoins () {
    return coins
}

function getInTradeCoins () {
    return inTradeCoins
}

async function loadCoins () {
    try {
        await axios
            .get(`${config.serverURI}/coins/list/`)
            .then(res => {
                coins = res.data.results
            })
    } catch (e) {
        telegramBot.sendTelegramMessage(e.message)
    }

    return coins
}


async function start () {
    await loadCoins()
    const workCoins = getCoins()
    workCoins.forEach(coin => {
        const coinInTrade = inTradeCoins.find(item => item.id === coin.id)
        if (!coinInTrade) {
            const trader = new Trader(coin)
            trader.start()
            inTradeCoins.push(coin)
        }
    })
}

async function launch () {
    await start()

    telegramBot.sendTelegramMessage(`${getInTradeCoins().length} coins in trade...`)

    setInterval(() => {
        start().then(() => {
            telegramBot.sendTelegramMessage(`${getInTradeCoins().length} coins in trade...`)
        })
    }, 1000 * 60 * 120)
}


module.exports = {
    launch
}
