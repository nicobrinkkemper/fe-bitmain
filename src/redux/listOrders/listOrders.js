import { LIST_ORDERS_RECEIVED, LIST_ORDERS_ERROR, RESET_LIST_ORDERS_REQUEST, RESET_LIST_ORDERS_RECEIVED, LIST_ORDERS_REQUEST } from '../actionTypes';
import { ofType } from 'redux-observable';
import { map, delayWhen, switchMap, takeUntil, repeat, catchError, delay } from 'rxjs/operators';
import { timer, merge, of } from 'rxjs'
import { ajax } from 'rxjs/ajax';

// SELECTORS
const nextUrl = (url, received) => {
    const toNumber = (val) => !isNaN(parseInt(val)) ? parseInt(val) : 0
    const urlObj = new URL(url)
    const start = toNumber(urlObj.searchParams.get('start'))
    const size = toNumber(urlObj.searchParams.get('size'))
    const newStart = start + received
    const slowDown = !!urlObj.searchParams.get('slowDown') || newStart % size !== 0
    const slowDownStr = slowDown
        ? '&slowDown=true'
        : ''
    const newSize = slowDown ? received + 2 : received
    return `${urlObj.origin}/listOrders?start=${newStart}&size=${newSize}${slowDownStr}`
}

// ACTIONS
export const listOrdersRequest = (payload = 'http://localhost:5001/listOrders?start=0&size=100') => {
    return {
        type: LIST_ORDERS_REQUEST,
        payload
    }
};
export const resetListOrdersRequest = (payload = 'http://localhost:5001/reset') => {
    return {
        type: RESET_LIST_ORDERS_REQUEST,
        payload
    }
};
const nextListOrdersRequest = action => listOrdersRequest(nextUrl(action.payload.request.url, action.payload.response.length))
const [listOrdersReceived, listOrdersError, resetListOrdersReceived] = [
    LIST_ORDERS_RECEIVED, LIST_ORDERS_ERROR, RESET_LIST_ORDERS_RECEIVED
]
    .map(
        type => (payload) => (
            {
                type,
                payload
            }
        )
    )

// EPIC
export const listOrdersEpic = action$ => {
    return merge(
        action$.pipe(
            ofType(LIST_ORDERS_REQUEST),
            switchMap(
                action => ajax(action.payload).pipe(
                    map(listOrdersReceived),
                    catchError(err => of(listOrdersError(err))),
                )
            ),
            takeUntil(action$.ofType(RESET_LIST_ORDERS_REQUEST)),
            repeat()
        ),
        action$.pipe(
            ofType(LIST_ORDERS_RECEIVED),
            delayWhen(
                action => !!(new URL(action.payload.request.url)).searchParams.get('slowDown')
                    ? timer(2000)
                    : timer(200)
            ),
            map(nextListOrdersRequest),
            takeUntil(action$.ofType(RESET_LIST_ORDERS_REQUEST)),
            repeat()
        ),
        action$.pipe(
            ofType(RESET_LIST_ORDERS_REQUEST),
            switchMap(
                action => ajax(action.payload).pipe(
                    map(resetListOrdersReceived),
                    catchError(err => of(listOrdersError(err))),
                )
            ),
        ),
        action$.pipe(
            ofType(LIST_ORDERS_ERROR),
            delay(2000),
            map(() => resetListOrdersRequest()),
        ),
        action$.pipe(
            ofType(RESET_LIST_ORDERS_RECEIVED),
            map(() => listOrdersRequest()),
        ),
    )
}

// REDUCER
const listOrders = (state = false, action) => {
    switch (action.type) {
        case LIST_ORDERS_REQUEST:
        case RESET_LIST_ORDERS_REQUEST:
            return true
        case LIST_ORDERS_RECEIVED:
            return false
        default:
            return state
    }
}

export default listOrders;