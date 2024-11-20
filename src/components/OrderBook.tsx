// src/components/OrderBook.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderBook } from '../features/orderBookSlice';
import { RootState,AppDispatch } from '../features/store';

const OrderBook = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bidOrders, askOrders, slippage, priceImpact, fees, percentageChange, loading, error } = useSelector(
    (state: RootState) => state.orderBook
  );

  useEffect(() => {
    dispatch(fetchOrderBook()); // Fetch initial data
    const interval = setInterval(() => {
      dispatch(fetchOrderBook()); // Polling every 2 seconds
    }, 2000);

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [dispatch]);

  const renderPriceTrend = (price: string, isBid: boolean) => {
    const trend = parseFloat(price) > 0 ? '↑' : '↓';
    return <span className={isBid ? 'text-green-500' : 'text-red-500'}>{trend}</span>;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Order Book</h2>

      <div className="flex mt-4">
        <div className="flex-1">
          <h3 className="text-lg">Top 5 Bids</h3>
          <table className="w-full border">
            <thead>
              <tr>
                <th>Price</th>
                <th>Volume</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {bidOrders.slice(0, 5).map((order, index) => (
                <tr key={index}>
                  <td>{order.price}</td>
                  <td>{order.volume}</td>
                  <td>{renderPriceTrend(order.price, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex-1">
          <h3 className="text-lg">Top 5 Asks</h3>
          <table className="w-full border">
            <thead>
              <tr>
                <th>Price</th>
                <th>Volume</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {askOrders.slice(0, 5).map((order, index) => (
                <tr key={index}>
                  <td>{order.price}</td>
                  <td>{order.volume}</td>
                  <td>{renderPriceTrend(order.price, false)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg">Real-Time Metrics</h3>
        <div>
          <p>Slippage: {slippage}</p>
          <p>Price Impact: {priceImpact}</p>
          <p>Fees: {fees}</p>
          <p>Percentage Change: {percentageChange}</p>
        </div>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default OrderBook;
