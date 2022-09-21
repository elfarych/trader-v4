import requests
from binance.error import ClientError
from env_config import ORDER_SIZE


def create_order(data, client, precisions):
    symbol = data['symbol'] + 'USDT'
    quantity = round(ORDER_SIZE / data['price'], precisions[symbol])

    new_order = client.new_order(
        symbol=symbol,
        side="SELL",
        type="MARKET",
        quantity=quantity
    )
    print(new_order)
    client.new_order(
        symbol=symbol,
        newClientOrderId=new_order['clientOrderId'],
        type="TAKE_PROFIT_MARKET",
        side="BUY",
        stopPrice=1200,
        closePosition='true'
    )
    client.new_order(
        symbol=symbol,
        newClientOrderId=new_order['clientOrderId'],
        type="STOP_MARKET",
        side="BUY",
        stopPrice=1360,
        closePosition='true'
    )
    # print(new_order)
    return new_order












# Side:
# BUY
# SELL
#
# Order Type:
# MARKET
# LIMIT
# STOP
# TAKE_PROFIT
# LIQUIDATION
#
# Execution Type:
# NEW
# CANCELED
# CALCULATED - Liquidation Execution
# EXPIRED
# TRADE
#
#
# Order Status:
# NEW
# PARTIALLY_FILLED
# FILLED
# CANCELED
# EXPIRED
# NEW_INSURANCE - Liquidation with Insurance Fund
# NEW_ADL - Counterparty Liquidation`
#
#
# Time in force:
# GTC
# IOC
# FOK
# GTX
#
#
# Working Type:
# MARK_PRICE
# CONTRACT_PRICE