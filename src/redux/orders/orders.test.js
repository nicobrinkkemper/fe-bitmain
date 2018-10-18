import orders, { addOrder } from './orders.js'
import MockDate from 'mockdate';
MockDate.set('1/1/2000');
const data = [
  {
    "id": 1,
    "type": "sell",
    "quantity": 6,
    "price": 480
  },
  {
    "id": 2,
    "type": "buy",
    "quantity": 8,
    "price": 470
  },
  {
    "id": 3,
    "type": "buy",
    "quantity": 5,
    "price": 460
  },
  {
    "id": 4,
    "type": "sell",
    "quantity": 10,
    "price": 460
  }
]

describe('reducers', () => {
  it('should match snapshot', () => {
    expect(
      data.map(addOrder).reduce(orders, [])
    ).toMatchSnapshot();
  })
})