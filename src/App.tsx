// src/App.tsx
import WalletConnect from './components/WalletConnect';
import TokenManagement from './components/TokenManagement';
import OrderBook from './components/OrderBook';

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Crypto</h1>
      <WalletConnect />
      <TokenManagement />
      <OrderBook />
    </div>
  );
};

export default App;
