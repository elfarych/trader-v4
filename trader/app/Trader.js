const axios = require('axios')
const WebSocket = require("ws")
const telegramSender = require('./sender')
const config = require('./config')
const envConfig = require('../env_config')
const order = require('./order')

class Trader {
    coin
    inTrade = false
    currentPrice = 0
    started = false
    booksStarted = false
    tradeDensity

    constructor(coin) {
        this.coin = coin
    }

    sendTelegramMessage(message) {
        telegramSender.sendTelegramMessage(message)
    }

    getInTradeStatus() {
        return this.inTrade
    }

    getTradeDensity() {
        return this.tradeDensity
    }

    getCurrentPrice() {
        return this.currentPrice
    }

    getDifferencePercent(val1, val2) {
        if (typeof val1 === 'string' || typeof val2 === 'string') {
            val1 = parseFloat(val1)
            val2 = parseFloat(val2)
        }
        return (val2 - val1) / val1 * 100
    }

    getCoin() {
        return this.coin
    }

    priceScreener() {
        let oldPrice = 0
        const symbol = this.coin.symbol?.toLowerCase() + 'usdt'
        const ws = new WebSocket(`${config.spotWebSocketURI}/ws/${symbol}@ticker`)

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            const price = parseFloat(data.c)
            this.currentPrice = price
            oldPrice = price
        }

        ws.onerror = (err) => {
            this.started = false
            this.sendTelegramMessage('price screener error')
        }
    }

    booksScreener() {
        const symbol = this.coin.symbol?.toLowerCase() + 'usdt'
        const ws = new WebSocket(`${config.spotWebSocketURI}/ws/${symbol}@bookTicker`)

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            // buy limit
            const bidPrice = parseFloat(data.b)
            const bidQuantity = parseFloat(data.B)
            const bid = {
                type: 'buyLimit',
                price: bidPrice,
                quantity: bidQuantity,
                usd: bidPrice * bidQuantity
            }

            // sell limit
            const askPrice = parseFloat(data.a)
            const askQuantity = parseFloat(data.A)
            const ask = {
                type: 'sellLimit',
                price: askPrice,
                quantity: askQuantity,
                usd: askPrice * askQuantity
            }

            this.booksHandler(bid, ask)
        }

        ws.onerror = (err) => {
            this.booksStarted = false
            this.sendTelegramMessage('books screener error')
        }
    }

    async booksHandler(bid, ask) {
        const coinInTrade = this.getInTradeStatus()
        if (coinInTrade || !this.getCurrentPrice()) return null

        const ticker = this.getCoin()
        const density = ticker.density || this.getTradeDensity()

        if (bid.usd >= density) {
            this.trade('buy', new Intl.NumberFormat('en').format(bid.usd))
        } else if (ask.usd >= density) {
            this.trade('sell', new Intl.NumberFormat('en').format(ask.usd))
        }
    }

    trade(orderType, density = undefined, reasonPrice = undefined) {
        this.inTrade = true
        const ticker = this.getCoin()
        const price = this.getCurrentPrice()
        let stopLoss, takeProfit

        if (orderType === 'buy') {
            stopLoss = price - ticker.loss_pips
            takeProfit = price + ticker.profit_pips
        } else if (orderType === 'sell') {
            stopLoss = price + ticker.loss_pips
            takeProfit = price - ticker.profit_pips
        }

        this.createOrder({stopLoss, takeProfit, orderPrice: price, orderType, density, reasonPrice})
    }

    async createOrder(params) {
        const {stopLoss, takeProfit, orderPrice, orderType} = params
        const ticker = this.getCoin()

        const orderCreator = new order.Order( parseFloat(orderPrice.toFixed(ticker.digits)), ticker.symbol.toUpperCase() + 'USDT')

        if (orderType.toUpperCase() === 'BUY') {
            orderCreator.createBuyOrder({
                takeProfit: parseFloat(takeProfit.toFixed(ticker.digits)),
                stopLoss: parseFloat(stopLoss.toFixed(ticker.digits))
            })
        }

        if (orderType.toUpperCase() === 'SELL') {
            orderCreator.createSellOrder({
                takeProfit: parseFloat(takeProfit.toFixed(ticker.digits)),
                stopLoss: parseFloat(stopLoss.toFixed(ticker.digits))
            })
        }



        this.sendTelegramMessage(`
                --- #${ticker.name} ---
                #NewOrder
                Order type: #${orderType.toUpperCase()}
                Open price: ${orderPrice.toFixed(ticker.digits)}
                Stop loss: ${stopLoss.toFixed(ticker.digits)}
                Take profit: ${takeProfit.toFixed(ticker.digits)}
                `)

        await axios.post(`${config.serverURI}/create_order/`, {
            coin: ticker.id,
            type: orderType.toUpperCase(),
            price: orderPrice,
            stop_loss: stopLoss.toFixed(ticker.digits),
            take_profit: takeProfit.toFixed(ticker.digits),
            reason_density: params.density,
            reason_price: params.reasonPrice
        }).then(res => {
            this.orderWatcher(params, res.data.id)
        }).catch(err => {
            this.sendTelegramMessage(err.message)
        })
    }

    orderWatcher(order, id = undefined) {
        const symbol = this.coin.symbol?.toLowerCase() + 'usdt'
        const {stopLoss, takeProfit, orderPrice, orderType} = order
        const ws = new WebSocket(`${config.spotWebSocketURI}/ws/${symbol}@ticker`)

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            const price = parseFloat(data.c)

            if (orderType === 'buy') {
                if (price >= takeProfit) {
                    this.inTrade = false
                    const profitPercent = Math.abs(this.getDifferencePercent(orderPrice, takeProfit))

                    this.sendOrderResults({
                        id,
                        result: 'TakeProfit',
                        resultPercent: profitPercent.toFixed(2),
                        orderType: 'Buy',
                        orderPrice,
                        closePrice: price
                    })
                    ws.close()
                }
                if (price <= stopLoss) {
                    this.inTrade = false
                    const lossPercent = Math.abs(this.getDifferencePercent(orderPrice, stopLoss))

                    this.sendOrderResults({
                        id,
                        result: 'StopLoss',
                        resultPercent: lossPercent.toFixed(2),
                        orderType: 'Buy',
                        orderPrice,
                        closePrice: price
                    })
                    ws.close()
                }
            }


            if (orderType === 'sell') {
                if (price <= takeProfit) {
                    this.inTrade = false
                    const profitPercent = Math.abs(this.getDifferencePercent(orderPrice, takeProfit))
                    this.sendOrderResults({
                        id,
                        result: 'TakeProfit',
                        resultPercent: profitPercent.toFixed(2),
                        orderType: 'Sell',
                        orderPrice,
                        closePrice: price
                    })
                    ws.close()
                }
                if (price >= stopLoss) {
                    this.inTrade = false
                    const lossPercent = Math.abs(this.getDifferencePercent(orderPrice, stopLoss))

                    this.sendOrderResults({
                        id,
                        result: 'StopLoss',
                        resultPercent: lossPercent.toFixed(2),
                        orderType: 'Sell',
                        orderPrice,
                        closePrice: price
                    })
                    ws.close()
                }
            }
        }
        ws.onerror = (err) => {
            this.sendTelegramMessage('orderWatcher error!!!')
        }
    }

    sendOrderResults(order) {
        const ticker = this.getCoin()

        this.sendTelegramMessage(`
        --- #${ticker.name} ---
        #${order.result} ${order.resultPercent}%
        Order type: #${order.orderType.toUpperCase()}
        Open price: ${order.orderPrice.toFixed(ticker.digits)}
        Close price: ${order.closePrice.toFixed(ticker.digits)}
        `)

        axios.patch(`${config.serverURI}/order/${order.id}/`, {
            profit_order: order.result === 'TakeProfit',
            loss_order: order.result === 'StopLoss',
            profit_percent: order.result === 'TakeProfit' ? parseFloat(order.resultPercent) : undefined,
            loss_percent: order.result === 'StopLoss' ? parseFloat(order.resultPercent) : undefined
        }).catch(err => {
            this.sendTelegramMessage(err.message)
        })
    }

    async start() {
        this.priceScreener()
        this.booksScreener()
        this.updateCoin()
    }

    async updateCoin() {
        const ticker = this.getCoin()
        setInterval(async () => {
            await axios
                .get(`${config.serverURI}/coins/detail/${ticker.id}/`)
                .then(res => {
                    this.coin = res.data
                })
                .catch(err => {
                    this.sendTelegramMessage(err.message)
                })
        }, 1000 * 60 * 15)
    }
}

module.exports = Trader
