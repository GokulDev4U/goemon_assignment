// src/components/TokenManagement.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTokenMetadata, addToken } from "../features/tokenSlice";
import { RootState, AppDispatch } from "../features/store";

const TokenManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tokens, loading, error } = useSelector((state: RootState) => state.token);
  const [tokenAddress, setTokenAddress] = useState("");
  console.log('tokens',tokens)

  const handleAddToken = async () => {
    if (tokenAddress) {
      dispatch(fetchTokenMetadata(tokenAddress));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(e.target.value);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Token Management</h2>
      <div>
        <input
          type="text"
          value={tokenAddress}
          onChange={handleInputChange}
          className="p-2"
          placeholder="Enter Token Contract Address"
        />
        <button
          onClick={handleAddToken}
          className="btn btn-primary"
        >
          Add Token
        </button>
      </div>

      {loading && <p>Loading token metadata...</p>}
      <div className="mt-4">
        {tokens.map((token, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2"
          >
            <span>
              {token.name} ({token.symbol})
            </span>
            <span>Price: ${token.price}</span>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default TokenManagement;
