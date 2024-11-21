// src/features/tokenSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Token {
  contractAddress: string;
  ethBalance: string;
}

interface TokenState {
  tokens: Token[];
  tokenAddress: string[];
  address: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TokenState = {
  tokens: [],
  tokenAddress: ["0x4d76a87f6f52dc46c0d17c85e9a00d50b33524f9", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"],
  address: null,
  loading: false,
  error: null,
};

interface AsyncThunkConfig {
  rejectValue: string;
}

export const fetchTokenMetadata = createAsyncThunk<{ tokens: Token[]; address: string }, string, AsyncThunkConfig>(
  "tokens/fetchTokenMetadata",
  async (address, { rejectWithValue }) => {
    try {
      // Fetch token metadata
      const url = "https://eth-mainnet.g.alchemy.com/v2/Gy8_NZ1Ow6AYRTC7vtCaXE6kkXGvZPku";
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      const body = {
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        params: [
          // "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          address,
          "erc20",
        ],
      };
      const response = await axios.post(url, body, { headers });
      const data = response.data;
      console.log("data-token", data.result);
      const balances = response.data.result.tokenBalances;

      const ethArr = balances.map((token: any) => {
        const weiBalance = BigInt(token.tokenBalance); // Use BigInt for large numbers
        const ethBalance = Number(weiBalance) / Math.pow(10, 18); // Convert to ETH
        return { contractAddress: token.contractAddress, ethBalance: `${ethBalance} ETH` };
      });
      // console.log("ethArr", ethArr);

      // Validate response structure
      if (!data?.result?.tokenBalances) {
        throw new Error("Invalid response structure");
      }

      return {
        address,
        tokens: ethArr,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch token metadata");
    }
  }
);

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    addToken: (state, action) => {
      if (!state.tokenAddress.includes(action.payload)) state.tokenAddress.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenMetadata.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTokenMetadata.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        const { tokens, address } = action.payload;
        // state.tokens.push(tokens);
        // state.tokens = [...state.tokens, ...tokens];
        state.tokens = tokens;
        state.address = address;
        state.loading = false;
      })
      .addCase(fetchTokenMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addToken } = tokenSlice.actions;

export default tokenSlice.reducer;
