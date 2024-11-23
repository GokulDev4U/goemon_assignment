import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BrowserProvider, formatEther } from 'ethers';

interface WalletDetails {
  address: string;
  balance: string;
}

interface WalletState {
  address: string | null;
  balance: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  address: null,
  balance: null,
  loading: false,
  error: null,
};

// Async thunk to connect wallet and fetch balance
export const connectWallet = createAsyncThunk<WalletDetails, void, { rejectValue: string }>(
  'wallet/connectWallet',
  async (_, { rejectWithValue }) => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) throw new Error('Ethereum object not found');
      
      // Connect to MetaMask
      const provider = new BrowserProvider(ethereum);
      const accounts = await provider.send('eth_requestAccounts', []); // Request MetaMask access
      // const signer = provider.getSigner();
      const address = accounts[0];
      const balanceInWei = await provider.getBalance(address);
      const balance = formatEther(balanceInWei); // Convert to ether

      return { address, balance };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.address = action.payload.address;
        state.balance = action.payload.balance;
        state.loading = false;
        state.error = null; // Clear error on success
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default walletSlice.reducer;
