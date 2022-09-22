const app = require('./app')
const order = require('./app/order')


order.setPrecisions().then(() => {
    app.launch()
})



