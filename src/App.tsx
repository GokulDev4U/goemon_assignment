// src/App.tsx
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./features/store";
import { useEffect } from "react";
import { OrderBook, SwapSimulationForm, TokenManagement, WalletConnect } from "./components";

const App = () => {

  const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);
  return (
    <div className="container mx-auto p-4 max-w-full overflow-x-hidden">
        <Routes>
          <Route path='/' element={<WalletConnect />}/>
          <Route path='/tokenManagement' element={<TokenManagement />}/>
          <Route path='/orderBook' element={<OrderBook />}/>
          <Route path='/swapToken' element={<SwapSimulationForm />}/>
        </Routes>
    </div>
  );
};

export default App;
