// src/App.tsx
import WalletConnect from "./components/WalletConnect";
import TokenManagement from "./components/TokenManagement";
import OrderBook from "./components/OrderBook";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold">Crypto</h1> */}
        <Routes>
          <Route path='/' element={<WalletConnect />}/>
          <Route path='/tokenManagement' element={<TokenManagement />}/>
          <Route path='/orderBook' element={<OrderBook />}/>
        </Routes>
    </div>
  );
};

export default App;
