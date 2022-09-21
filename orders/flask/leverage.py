import requests
from binance.error import ClientError


def set_leverage(uri, client):
    r = requests.get(uri + '/coins/list/')
    data = r.json()
    coins = data['results']

    for coin in coins:
        symbol = coin['symbol'] + 'USDT'

        try:
            client.change_margin_type(symbol=symbol, marginType='ISOLATED')
        except ClientError as error:
            if error.error_message != 'No need to change margin type.':
                return error.error_message

        try:
            client.change_leverage(symbol=symbol, leverage=coin['leverage'])
        except ClientError as error:
            return error.error_message

    return 'Success'
