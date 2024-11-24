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

  // console.log("address", address);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Token Management</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white shadow-md rounded-lg">
        <input
          type="text"
          value={tokenAddress}
          onChange={handleInputChange}
          className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          placeholder="Enter Token Contract Address to add to dropdown"
        />
        <button
          onClick={handleAddToken}
          className="w-full sm:w-auto px-6 py-2 text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
          className="w-64 z-20 relative my-2"
        />
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full border border-gray-200 shadow-md rounded-lg">
              {/* Table Header */}
              <thead className="bg-blue-600 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Contract Address</th>
                  <th className="px-4 py-2 text-left font-medium">Balance</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {tokens.map((token, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{token.contractAddress}</td>
                    <td className="px-4 py-2 text-gray-700">{token.ethBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenManagement;
