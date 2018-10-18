import { PropTypes } from 'prop-types';
import React from 'react';
import './styles.css';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US')

const Spinner = ({ show }) => (
  <div className={`Spinner${show ? ' show' : ''}`}><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>
)
const MatchInfo = (match) => (
  <div className="MatchInfo">
    <div className="ts">
      Matched {timeAgo.format(match.ts)}
    </div>
    
    <div>Before:</div>
    <div className={`order ${match.order.type}`}>
      {match.order.quantity}x{match.order.price}btc
    </div>
    <div className={`order ${match.counterOrder.type}`}>
      {match.counterOrder.quantity}x{match.counterOrder.price}btc
    </div>
    <div>After:</div>
    <div className={`order ${match.order.type}`}>
      {match.orderResult.quantity ? match.orderResult.quantity+"x"+match.orderResult.price+"btc" : "Depleted"}
    </div>
    <div className={`order ${match.counterOrder.type}`}>
      {match.counterOrderResult.quantity ? match.counterOrderResult.quantity+"x"+match.counterOrderResult.price+"btc" : "Depleted"}
    </div>
  </div>
)
export const OrderBookView = ({ reset, sells, buys, matches, isLoading, toggleMatch }) => (
  <div className="OrderBook">
    <div className="Orders">
      <ul id={'buy'}>
        <li id="reset-header" className="header"><a href="#reset" onClick={reset}>Reset</a></li>
        <li id="buy-header" className="header"><span>Buys</span></li>
        {
          buys.map(
            order => (
              <li key={order.id} id={`order-${order.id}`} className="order buy">
                <span className="tinyId">{order.id}</span>
                <span className="descriptor">{order.quantity}x{order.price}btc</span>
              </li>
            )
          )
        }
      </ul>
      <ul id={'sell'}>
        <li id="fillsell-header" className="header"></li>
        <li id="sell-header" className="header"><span>Sells</span></li>
        {
          sells.map(
            order => (
              <li key={order.id} id={`order-${order.id}`} className="order sell">
                <span className="tinyId">{order.id}</span>
                <span className="descriptor">{order.quantity}x{order.price}btc</span>
              </li>
            )
          )
        }
      </ul>
      <ul id={'match'}>
        <li id="loading-header" className="header"><Spinner show={isLoading} /></li>
        <li id="match-header" className="header"><span>Matches</span></li>
        {
          matches.map(
            match => (
              <li onClick={() => toggleMatch(match)}
                key={match.id}
                id={`match-${match.id}`}
                className={`order match${match.toggled ? ' toggled' : ''}`}>
                <div className="toggle">
                  <span className="tinyId">{match.id}</span>
                  <span className="descriptor">{match.quantity}x{match.price}btc</span>
                  {(match.toggled ? <MatchInfo {...match} /> : null)}
                </div>
              </li>
            )
          )
        }
      </ul>
    </div>
  </div>
);
const orderPropTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  type: PropTypes.string,
  price: PropTypes.number,
  quantity: PropTypes.number,
}
const matchPropTypes = {
  ...orderPropTypes,
  order: PropTypes.shape(orderPropTypes),
  counterOrder: PropTypes.shape(orderPropTypes),
  orderResult: PropTypes.shape(orderPropTypes),
  counterOrderResult: PropTypes.shape(orderPropTypes)
}

OrderBookView.propTypes = {
  sells: PropTypes.arrayOf(PropTypes.shape(orderPropTypes)).isRequired,
  buys: PropTypes.arrayOf(PropTypes.shape(orderPropTypes)).isRequired,
  matches:  PropTypes.arrayOf(PropTypes.shape(matchPropTypes)).isRequired,
};
export default OrderBookView;