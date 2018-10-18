import { ADD_ORDER, TOGGLE_MATCH, MATCH_ORDER, LIST_ORDERS_RECEIVED, RESET_LIST_ORDERS_RECEIVED, RESET_LIST_ORDERS_REQUEST } from '../actionTypes';
import { ORDER_TYPES } from '../../constants';
import { createSelector } from 'reselect'
// SELECTORS
export const hasQuantity = ({ quantity }) => quantity > 0
export const tsDesc = ({ ts: a }, { ts: b }) => b - a
export const idAsc = ({ id: a }, { id: b }) => a - b
export const isBuy = ({ type }) => type === ORDER_TYPES.BUY
export const isSell = ({ type }) => type === ORDER_TYPES.SELL
export const isMatch = ({ type }) => type === ORDER_TYPES.MATCH
export const priceDesc = ({ price: a }, { price: b }) => a - b
export const priceAsc = ({ price: a }, { price: b }) => b - a
const counterDeal = order => isSell(order)
    ? counterOrder => isBuy(counterOrder) && hasQuantity(counterOrder) && counterOrder.price >= order.price
    : counterOrder => isSell(counterOrder) && hasQuantity(counterOrder) && counterOrder.price <= order.price

export const selectMatches = createSelector(
    orders => orders
        .filter(isMatch),
    orders => orders
        .sort(tsDesc)
        .slice(0, 30)
)
export const selectSells = createSelector(
    orders => orders
        .filter(isSell),
    orders => orders
        .filter(hasQuantity)
        .sort(idAsc)
        .sort(priceAsc)
        .slice(0, 20)
)
export const selectBuys = createSelector(
    orders => orders
        .filter(isBuy),
    orders => orders
        .filter(hasQuantity)
        .sort(idAsc)
        .sort(priceDesc)
        .slice(0, 20)
)

// ACTIONS
export const [addOrder, toggleMatch, matchOrder] = [
    ADD_ORDER, TOGGLE_MATCH, MATCH_ORDER
]
    .map(
        type => payload => (
            {
                type,
                payload
            }
        )
    )

// EPICS

// REDUCERS
export const orders = (state = [], action) => {
    switch (action.type) {
        case TOGGLE_MATCH:{
            const order = action.payload;
            return state.map(
                _order => _order.id === order.id
                    ? { ..._order, toggled: !_order.toggled }
                    : _order
            )
        }
        case RESET_LIST_ORDERS_REQUEST:
        case RESET_LIST_ORDERS_RECEIVED:
            return []
        case LIST_ORDERS_RECEIVED:
            return action.payload.response.map(addOrder).reduce(orders, state)
        case ADD_ORDER:{
            const order = action.payload;
            if(!hasQuantity(order)) return [...state, order]
            const counterOrder = state.find(counterDeal(order))
            if (!counterOrder) return [...state, order]
            return orders(state, matchOrder({order,counterOrder}))
        }
        case MATCH_ORDER:{
            const {order,counterOrder} = action.payload;
            const price = (order.price + counterOrder.price) / 2
            const quantity = Math.min(order.quantity, counterOrder.quantity)
            const ts = Date.now()
            const orderResult = { ...order, quantity: order.quantity - quantity }
            const counterOrderResult = { ...counterOrder, quantity: counterOrder.quantity - quantity }
            const match = {
                id: order.id + '-' + counterOrder.id,
                type: ORDER_TYPES.MATCH,
                orderResult,
                counterOrderResult,
                order,
                counterOrder,
                price,
                quantity,
                ts,
                toggled: false
            }
            const updatedState = [
                ...state.map(
                    _order => _order.id === counterOrder.id
                        ? counterOrderResult
                        : _order
                ),
                match
            ]
            return orders(updatedState, addOrder(orderResult))
        }
        default:
            return state
    }
}

export default orders