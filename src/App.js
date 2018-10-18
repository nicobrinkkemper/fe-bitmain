import React from 'react';
import './App.css';
import OrderBook from './OrderBook/OrderBook';
import { Provider } from 'react-redux'
import store from './store';

export const App = () => (
  <div className="App">
    <Provider store={store}><OrderBook /></Provider>
  </div>
)
export default App;
