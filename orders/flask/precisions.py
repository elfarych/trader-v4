import requests


def get_precisions():
    quantity_precisions = {}
    r = requests.get('https://fapi.binance.com/fapi/v1/exchangeInfo')
    data = r.json()
    for symbol in data['symbols']:
        quantity_precisions[symbol['symbol']] = symbol['quantityPrecision']

    return quantity_precisions
