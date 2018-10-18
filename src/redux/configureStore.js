import { compose, combineReducers } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import listOrders, { listOrdersEpic } from './listOrders/listOrders';
import orders from './orders/orders';

const epicMiddleware = createEpicMiddleware();

export default function configureStore() {
  const rootEpic = combineEpics(
    listOrdersEpic
  );
  const rootReducer = combineReducers(
    {
      listOrders,
      orders
    }
  );
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
