const app = require('./app')
const envConfig = require('./env_config')
const axios = require('axios')
const order = require('./app/order')


// const orderCreator = new order.Order(1288, 'ETHUSDT')

order.setPrecisions().then(() => {
    app.launch()
    // orderCreator.createBuyOrder({ takeProfit: 1289, stopLoss: 1287 })
})



