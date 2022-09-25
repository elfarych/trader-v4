const Binance = require('node-binance-api')
const envConfig = require('../env_config')
const telegram = require('./sender')
const precisions = {}


const binance = new Binance().options({
    adjustForTimeDifference: true,
    APIKEY: envConfig.API_KEY,
    APISECRET: envConfig.SECRET_KEY
})


async function setPrecisions() {
    const info = await binance.futuresExchangeInfo()
    const symbols = info.symbols
    symbols.forEach(symbol => precisions[symbol.symbol] = symbol.quantityPrecision)
}


class Order {
    price
    symbol
    coin

    constructor(coin, price) {
        this.coin = coin
        this.price = price
        this.symbol = coin.symbol + 'USDT'
    }

    async cancelOrders() {
        await binance.futuresCancelAll(this.symbol)
    }

    async createBuyOrder() {
        await this.cancelOrders()

        await binance
            .futuresMarketBuy(this.symbol, (envConfig.ORDER_SIZE / this.price).toFixed(precisions[this.symbol]), {newOrderRespType: 'RESULT'})
            .then(async (res) => {

                const takeProfitPrice = parseFloat(res.avgPrice) + parseFloat(this.coin.profit_pips)
                const stopLossPrice = parseFloat(res.avgPrice) - parseFloat(this.coin.loss_pips)

                await this.createSellStopOrder(stopLossPrice, 'STOP_MARKET')
                setTimeout(() => {
                    this.createSellStopOrder(takeProfitPrice, 'TAKE_PROFIT_MARKET')
                }, 2000)

                if (res.msg) {
                    telegram.sendTelegramMessage(`${this.symbol} - ${res.msg}`)
                } else {
                    telegram.sendTelegramMessage(`${this.symbol} - Order filled...`)
                }
            })
    }

    async createSellOrder() {
        await this.cancelOrders()

        await binance
            .futuresMarketSell(this.symbol, (envConfig.ORDER_SIZE / this.price).toFixed(precisions[this.symbol]), {newOrderRespType: 'RESULT'})
            .then(async (res) => {

                const takeProfitPrice = parseFloat(res.avgPrice) - parseFloat(this.coin.profit_pips)
                const stopLossPrice = parseFloat(res.avgPrice) + parseFloat(this.coin.loss_pips)

                await this.createBuyStopOrder(stopLossPrice, 'STOP_MARKET')
                setTimeout(() => {
                    this.createBuyStopOrder(takeProfitPrice, 'TAKE_PROFIT_MARKET')
                }, 2000)

                if (res.msg) {
                    telegram.sendTelegramMessage(`${this.symbol} - ${res.msg}`)
                } else {
                    telegram.sendTelegramMessage(`${this.symbol} - Order filled...`)
                }
            })
    }

    async createSellStopOrder(stopPrice, type) {
        await binance
            .futuresSell(this.symbol, null, null, {
                type,
                closePosition: true,
                stopPrice
            })
    }

    async createBuyStopOrder(stopPrice, type) {
        await binance
            .futuresBuy(this.symbol, null, null, {
                type,
                closePosition: true,
                stopPrice
            })
    }
}


module.exports = {
    setPrecisions,
    Order
}
