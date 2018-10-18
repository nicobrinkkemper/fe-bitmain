import React, { Component } from 'react';
import OrderBookView from './OrderBookView/OrderBookView';

export class OrderBookController extends Component {

  componentDidMount() {
    this.props.listOrders()
  }

  render() {
    const {
      sells,
      buys,
      matches,
      toggleMatch,
      isLoading,
      reset
    } = this.props;
    return (
      <OrderBookView {...{
        sells,
        buys,
        matches,
        toggleMatch,
        isLoading,
        reset
      }} />
    );
  }
}

export default OrderBookController;