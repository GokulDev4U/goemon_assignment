import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTransactionStatus } from "../features/transactionSlice";
import { AppDispatch } from "../features/store";
import ConfirmationModal from "./ConfirmationModal";
import { ethers } from "ethers";

const SwapSimulationForm = () => {
  const [formData, setFormData] = useState({
    fromTokenAddress: "0xd152f549545093347a162dce210e7293f1452150",
    toTokenAddress: "0x5c43B1eD97e52d009611D89b74fA829FE4ac56b1",
    fromAmount: "",
    slippage: "1", // slippage: 1%
    userAddress: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fromTokenAddress, toTokenAddress, fromAmount, slippage, userAddress } = formData;
  const toAmount = (parseFloat(fromAmount) * (1 - parseFloat(slippage) / 100)).toFixed(4);
  const fees = (parseFloat(fromAmount) * (parseFloat(slippage) / 100)).toFixed(4);
  const baseGasFee = 0.005; // Fixed base gas fee
  const gasFees = (baseGasFee * (1 + parseFloat(slippage) / 100)).toFixed(4) + " ETH";

  const transactionDetails = {
    fromToken: fromTokenAddress,
    toToken: toTokenAddress,
    fromAmount: fromAmount,
    toAmount: toAmount,
    fees: fees,
    gasFees: gasFees,
    slippage: slippage,
  };

  const dispatch = useDispatch<AppDispatch>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

//   const handleTransactionSubmit = async () => {
//     const url = "https://eth-mainnet.g.alchemy.com/v2/Gy8_NZ1Ow6AYRTC7vtCaXE6kkXGvZPku";
//     const headers = {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     };

//     const dynamicPayload = {
//       id: 1,
//       jsonrpc: "2.0",
//       method: "alchemy_getAssetTransfers",
//       params: [
//         {
//           fromBlock: "0x0",
//           toBlock: "latest",
//           toAddress: toTokenAddress || "0x5c43B1eD97e52d009611D89b74fA829FE4ac56b1",
//           withMetadata: false,
//           excludeZeroValue: true,
//           maxCount: "0x64", // 100 transfers (in hex)
//           category: ["erc20"],
//         },
//       ],
//     };

//     try {
//       dispatch(setTransactionStatus("pending"));

//       const response = await axios.post(url, dynamicPayload, { headers });

//       console.log("API Response:", response.data.result.transfers.length);
//       console.log("API Response:", response.data.result.transfers[0]);

//       // Success simulation
//       dispatch(setTransactionStatus("success"));
//     } catch (error) {
//       console.error("Error:", error);
//       dispatch(setTransactionStatus("failed"));
//     }
//   };

  const handleTransactionSubmit = async () => {
    // Check if the wallet is connected (for example, with MetaMask)
    if (!window.ethereum) {
      alert("Wallet is not connected. Please connect your wallet.");
      return;
    }
  
    // Check if the user has enough balance (for example, with MetaMask)
    const userBalance = await checkUserTokenBalance(fromTokenAddress);
    if (parseFloat(fromAmount) > parseFloat(userBalance)) {
      alert("Insufficient token balance for this transaction.");
      return;
    }
  
    const url = "https://eth-mainnet.g.alchemy.com/v2/Gy8_NZ1Ow6AYRTC7vtCaXE6kkXGvZPku";
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  
    const dynamicPayload = {
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          toAddress: toTokenAddress || "0x5c43B1eD97e52d009611D89b74fA829FE4ac56b1",
          withMetadata: false,
          excludeZeroValue: true,
          maxCount: "0x64", // 100 transfers (in hex)
          category: ["erc20"],
        },
      ],
    };
  
    try {
      dispatch(setTransactionStatus("pending"));
  
      const response = await axios.post(url, dynamicPayload, { headers });
  
      // Check if response has transfers data
      if (response.data.result && response.data.result.transfers.length > 0) {
        console.log("API Response:", response.data.result.transfers.length);
        console.log("API Response:", response.data.result.transfers[0]);
  
        // Success simulation
        dispatch(setTransactionStatus("success"));
      } else {
        throw new Error("No transfers found. Transaction may have been rejected.");
      }
    } catch (error: any) {
      console.error("Error:", error);
  
      // Handle specific error scenarios
      if (error.message.includes("insufficient balance")) {
        dispatch(setTransactionStatus("failed"));
        alert("Insufficient balance for transaction.");
      } else if (error.message.includes("Network Error")) {
        dispatch(setTransactionStatus("failed"));
        alert("Network congestion detected. Please try again later.");
      } else {
        dispatch(setTransactionStatus("failed"));
        alert("Transaction failed. Please try again.");
      }
    }
  };
  
  const checkUserTokenBalance = async (userAddress: string): Promise<string> => {
    try {
      if (!window.ethereum) {
        throw new Error("Ethereum provider not found. Please install MetaMask.");
      }
  
      // Initialize provider
      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const balanceInWei = await provider.getBalance(userAddress);
  
      // Convert and return balance
      return ethers.formatEther(balanceInWei);
    } catch (error: any) {
      // Custom error handling
      if (error.code === -32603) {
        console.error("Ethereum provider error: Network or wallet issue.", error);
      } else if (error.message.includes("Failed to fetch")) {
        console.error("Network connectivity issue or wallet disconnected.", error);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error; // Rethrow for higher-level handling
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Simulate Token Swap</h1>

      <form className="space-y-4">
        {/* From Token Address */}
        <div>
          <label
            htmlFor="fromTokenAddress"
            className="block text-sm font-medium text-gray-700"
          >
            From Token Address
          </label>
          <input
            type="text"
            id="fromTokenAddress"
            name="fromTokenAddress"
            placeholder="0xTokenA"
            value={fromTokenAddress}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* To Token Address */}
        <div>
          <label
            htmlFor="toTokenAddress"
            className="block text-sm font-medium text-gray-700"
          >
            To Token Address
          </label>
          <input
            type="text"
            id="toTokenAddress"
            name="toTokenAddress"
            placeholder="0xTokenB"
            value={toTokenAddress}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* From Amount */}
        <div>
          <label
            htmlFor="fromAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount to Swap (Token A)
          </label>
          <input
            type="number"
            id="fromAmount"
            name="fromAmount"
            placeholder="100"
            value={fromAmount}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Slippage */}
        <div>
          <label
            htmlFor="slippage"
            className="block text-sm font-medium text-gray-700"
          >
            Slippage (%) (Default: 1%)
          </label>
          <input
            type="number"
            id="slippage"
            name="slippage"
            placeholder="1"
            value={slippage}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* User Address */}
        <div>
          <label
            htmlFor="userAddress"
            className="block text-sm font-medium text-gray-700"
          >
            Your Wallet Address
          </label>
          <input
            type="text"
            id="userAddress"
            name="userAddress"
            placeholder="0xUserAddress"
            value={userAddress}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            Simulate Swap
          </button>
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            transactionDetails={transactionDetails}
            onSubmit={handleTransactionSubmit}
          />
        </div>
      </form>
    </div>
  );
};

export default SwapSimulationForm;
