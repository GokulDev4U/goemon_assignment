// src/components/TokenManagement.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTokenMetadata, addToken } from "../features/tokenSlice";
import { RootState, AppDispatch } from "../features/store";
import Dropdown from "../ui/DropDown";
import Loader from "../ui/Loader";

const TokenManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tokens, tokenAddress: address, loading, error } = useSelector((state: RootState) => state.token);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  // console.log('tokens',tokens)

  const handleAddToken = () => {
    if (tokenAddress) {
      dispatch(addToken(tokenAddress));
    }
  };

  const handleDropdownChange = (val: string) => {
    setSelectedValue(val);
    dispatch(fetchTokenMetadata(val));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(e.target.value);
  };

  console.log("address", address);

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

      {/* {loading && <p>Loading token metadata...</p>} */}

      {error && <p className="text-red-500">{error}</p>}

      {address && (
        <Dropdown<string>
          options={address}
          value={selectedValue}
          onChange={(value) => handleDropdownChange(value)}
          placeholder="Choose a token..."
          className="w-64"
        />
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="flex-1">
          {/* <h3 className="text-lg">Top 5 Asks</h3> */}
          <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Contract Address</th>
                <th className="px-4 py-2 text-left font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}
                >
                  <td className="px-4 py-2 text-gray-700">{token.contractAddress}</td>
                  <td className="px-4 py-2 text-gray-700">{token.ethBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TokenManagement;
