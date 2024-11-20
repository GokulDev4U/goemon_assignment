// src/components/WalletConnection.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet } from '../features/walletSlice';
import { RootState,AppDispatch } from '../features/store';

const WalletConnection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { address, balance, loading, error } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    // Automatically attempt to connect wallet on page load if MetaMask is available
    console.log('window.ethereum',window.ethereum)
    if (window.ethereum) {
      dispatch(connectWallet());
    }
  }, [dispatch]);

  const handleConnectWallet = () => {
    dispatch(connectWallet());
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
       <h2 className="text-xl font-bold">Wallet Connection</h2>
      {address ? (
        <div>
          <p>Wallet Address: {address}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      ) : (
        <button onClick={handleConnectWallet} className="btn border-t-neutral-300">
          Connect Wallet
        </button>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default WalletConnection;
