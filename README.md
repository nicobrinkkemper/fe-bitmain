# Summary

This is a simple trading platform Web UI. It should have access to [this api](https://github.com/btccom/fe-exercise-backend) at port 5001.
The original exercise of this project is found [here](https://github.com/btccom/Hire/blob/master/exercise/FE-exchange-en.md)
If you have the backend running at localhost:5001, you can visit [nicobrinkkemper.github.io/fe-bitmain/](https://nicobrinkkemper.github.io/fe-bitmain/) to see it working.

## Frontend UI

* sell order queue: max 20, sorted by id asc, price desc
* buy order queue: max 20, sorted by id asc, price asc
* match queue: max 30, sorted by created time desc.
* clicking a match shows time, price, sell order, buy order, etc.

## Example

A match is made when a buy and sell order share a price that is agreeable.
The average between the two is the match price.

A order has the following fields: id:int, type:string, quantity:int, price:int

* (1001, sell, 6, 480)
* (1002, buy, 8, 470)
* (1003, buy, 5, 460)

When a new order (1004, sell, 10, 460) comes, the resulting state is:

* (1001, sell, 6, 480)
* (1002, buy, DEPLETED)
* (1003, buy, 3, 460)
* (1004, sell, DEPLETED) 
* (1002-1004, match, 8, 465)
* (1003-1004, match, 2, 460)

## Design choises

This was written as part of a exercise for Bitmain.

- Used `react` for controller/view layer
- Used `redux` for model layer
- Used `redux-observable` epic for sideeffect handling with server