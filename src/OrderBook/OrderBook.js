import { connect } from 'react-redux';
import { listOrdersRequest, resetListOrdersRequest } from '../redux/listOrders/listOrders';
import { selectSells, selectBuys, selectMatches, toggleMatch } from '../redux/orders/orders'
import OrderBookController from './OrderBookController';

const mapStateToProps = store => {
  return {
    sells: selectSells(store.orders),
    buys: selectBuys(store.orders),
    matches: selectMatches(store.orders),
    isLoading: store.listOrders,
  }
};

const mapDispatchToProps = dispatch => ({
  listOrders: () => dispatch(listOrdersRequest()),
  toggleMatch: (match) => dispatch(toggleMatch(match)),
  reset: () => dispatch(resetListOrdersRequest())
})

const OrderBook = connect(mapStateToProps, mapDispatchToProps)(OrderBookController);
export default OrderBook;