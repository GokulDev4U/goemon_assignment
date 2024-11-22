// src/components/OrderBook.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderBook } from "../features/orderBookSlice";
import { RootState, AppDispatch } from "../features/store";
import Loader from "../ui/Loader";

const OrderBook = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bidOrders, askOrders, slippage, priceImpact, fees, percentageChange, loading, error } = useSelector((state: RootState) => state.orderBook);

  useEffect(() => {
    dispatch(fetchOrderBook()); // Fetch initial data
    // const interval = setInterval(() => {
    //   dispatch(fetchOrderBook()); // Polling every 2 seconds
    // }, 2000);

    // return () => clearInterval(interval); // Clean up the interval on unmount
  }, [dispatch]);

  const renderPriceTrend = (price: string) => {
    const trend = parseFloat(price) > 0 ? "↑" : "↓";
    return <span className={trend ? "text-green-500" : "text-red-500"}>{trend}</span>;
  };

  // type BidOrdersType = { price: string; volume: string };
  // type AskOrdersType = { price: string; volume: string };

  // const columns = [
  //   { header: "Price", accessor: "price" },
  //   { header: "Volume", accessor: "volume" },
  //   {
  //     Header: "Trend",
  //     accessor: "trend",
  //     Cell: ({ row }) => renderPriceTrend(row.original.price, true),
  //   },
  // ];

  // const bidOrdersData: BidOrdersType[] = bidOrders.slice(0, 5).map(order => ({
  //   ...order,
  //   trend: renderPriceTrend(order.price, true),
  // }));

  // const askOrdersData: AskOrdersType[] = askOrders.slice(0, 5).map(order => ({
  //   ...order,
  //   trend: renderPriceTrend(order.price, false),
  // }));

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Order Book</h2>

      {/* <Table<BidOrdersType> data={bidOrdersData.slice(0, 5)} columns={columns} className="shadow-md" /> */}

      {loading ? (
        <Loader />
      ) : (
        <div className="flex mt-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Bids</h3>
              <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-green-500 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Volume</th>
                    <th className="px-4 py-2 text-left">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {bidOrders.slice(0, 5).map((order, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50 transition`}
                    >
                      <td className="px-4 py-2 text-gray-700">{order.price}</td>
                      <td className="px-4 py-2 text-gray-700">{order.volume}</td>
                      <td className="px-4 py-2">{renderPriceTrend(order.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex-1 bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Asks</h3>
              <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-red-500 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Volume</th>
                    <th className="px-4 py-2 text-left">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {askOrders.slice(0, 5).map((order, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-red-50 transition`}
                    >
                      <td className="px-4 py-2 text-gray-700">{order.price}</td>
                      <td className="px-4 py-2 text-gray-700">{order.volume}</td>
                      <td className="px-4 py-2">{renderPriceTrend(order.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
        <h3 className="text-lg">Real-Time Metrics</h3>
        <div>
          <p>Slippage: {slippage}</p>
          <p>Price Impact: {priceImpact}</p>
          <p>Fees: {fees}</p>
          <p>Percentage Change: {percentageChange}</p>
        </div>
      </div>

    </div>
  );
};

export default OrderBook;
