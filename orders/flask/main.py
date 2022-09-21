from flask import Flask, request

from env_config import ADMIN_URI, SECRET_KEY, API_KEY

from leverage import set_leverage
from order import create_order
from binance.um_futures import UMFutures
from precisions import get_precisions


app = Flask(__name__)


binance_client = UMFutures(key=API_KEY, secret=SECRET_KEY)
precisions = get_precisions()


@app.route('/')
def report():
    return 'App working'


@app.route('/set_leverage')
def leverage():
    return set_leverage(ADMIN_URI, binance_client)


@app.route('/create_order', methods=['POST'])
def order():
    return create_order(data=request.json, client=binance_client, precisions=precisions)


if __name__ == '__main__':
    app.run(host='192.168.0.109', port=5000, debug=True)
