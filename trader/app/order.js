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

    constructor(coin, price) {
        this.price = price
        this.symbol = coin.symbol
    }

    async createBuyOrder(params = {}) {
        await binance
            .futuresMarketBuy(this.symbol, (envConfig.ORDER_SIZE / this.price).toFixed(precisions[this.symbol]))
            .then(res => {
                if (res.msg) {
                    telegram.sendTelegramMessage(`${this.symbol} - ${res.msg}`)
                } else {
                    telegram.sendTelegramMessage(`${this.symbol} - Order filled...`)
                }
            })

        await binance
            .futuresSell(this.symbol, null, null, {
                type: 'TAKE_PROFIT_MARKET',
                closePosition: true,
                stopPrice: params.takeProfit,
                newOrderRespType: 'RESULT'
            })
            .then(res => {
                if (res.msg) {
                    telegram.sendTelegramMessage(`${this.symbol} - ${res.msg}`)
                }
                this.checkStatus(res.orderId.toString())
            })

        await binance
            .futuresSell(this.symbol, null, null, {
                type: 'STOP_MARKET',
                closePosition: true,
                stopPrice: params.stopLoss,
                newOrderRespType: 'RESULT'
            })
            .then(res => {
                if (res.msg) {
                    telegram.sendTelegramMessage(`${this.symbol} - ${res.msg}`)
                }
                this.checkStatus(res.orderId.toString())
            })
    }


    async createSellOrder(params = {}) {
        await binance
            .futuresMarketSell(this.symbol, (envConfig.ORDER_SIZE / this.price).toFixed(precisions[this.symbol]), { newOrderRespType: 'RESULT' })
            .then(res => {
                console.log(res)
                if (res.msg) {
                    telegram.sendTelegramMessage(`${this.symbol} - ${res.msg}`)
                } else {
                    telegram.sendTelegramMessage(`${this.symbol} - Order filled...`)
                }
            })

        await binance
            .futuresBuy(this.symbol, null, null, {
                type: 'TAKE_PROFIT_MARKET',
                closePosition: true,
                stopPrice: params.takeProfit,
                newOrderRespType: 'RESULT'
            })
            .then(res => {
                if (res.msg) {
                    telegram.sendTelegramMessage(`${this.symbol} - ${res.msg}`)
                }
                this.checkStatus(res.orderId.toString())
            })

        await binance
            .futuresBuy(this.symbol, null, null, {
                type: 'STOP_MARKET',
                closePosition: true,
                stopPrice: params.stopLoss,
                newOrderRespType: 'RESULT'
            })
            .then(res => {
                if (res.msg) {
                    telegram.sendTelegramMessage(`${this.symbol} - ${res.msg}`)
                }
                this.checkStatus(res.orderId.toString())
            })
    }

    async checkStatus(orderId) {
        const status = await binance.futuresOrderStatus(this.symbol, {orderId})
        if (status.status === 'NEW') {
            setTimeout(() => {
                this.checkStatus(orderId)
            }, 5000)
        } else {
            binance.futuresCancelAll(this.symbol)
        }
    }
}


module.exports = {
    setPrecisions,
    Order
}
