import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../features/store";
import { useEffect } from "react";
import { fetchExchangeRate } from "../features/exchangeRateSlice";
import Loader from "../ui/Loader";

const ExchangeRate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rate,warning, loading, error } = useSelector((state: RootState) => state.exchangeRate);
  useEffect(() => {
    dispatch(fetchExchangeRate()); // Fetch initial data
    const interval = setInterval(() => {
      dispatch(fetchExchangeRate()); // Polling every 2 seconds
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div>
      <h1>Binance Exchange Rate (ETH/USDT)</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
        <p>Warning: {warning}</p>
        <p>Exchange rate : {rate}</p>
        </>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ExchangeRate;
