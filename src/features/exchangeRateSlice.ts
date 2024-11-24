// src/features/exchangeRateSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BinanceExchangeRateWebSocket from '../services/BinanceExchangeRateWebSocket';

interface ExchangeRateState {
  rate: number;
  warning: string | null;
  loading?: boolean;
  error?: string | null;
}

interface ExchangeRatePayload {
  rate: number;
  warning: string | null;
}

const initialState: ExchangeRateState = {
  rate: 0,
  warning: null,
  loading: false,
  error: null,
};

interface AsyncThunkConfig {
  rejectValue: string;
}

// Async thunk to fetch real-time exchange rate data
export const fetchExchangeRate = createAsyncThunk<ExchangeRatePayload, void, AsyncThunkConfig>(
  'exchangeRate/fetchExchangeRate',
  async (_, { rejectWithValue }) => {
    try {
      return new Promise<ExchangeRatePayload>((resolve, reject) => {
        // Subscribe to the WebSocket and process incoming data
        const callback = (data: any) => {
          if (data && data.rate !== undefined) {
            resolve({
              rate: data.rate,
              warning: data.warning || null,
            });

            // Unsubscribe after receiving valid data to prevent indefinite listening
            BinanceExchangeRateWebSocket.unsubscribe(callback);
          } else {
            reject(new Error('Invalid exchange rate data received from WebSocket'));
          }
        };

        BinanceExchangeRateWebSocket.subscribe(callback);

        // Optionally, add a timeout to handle cases where no data is received
        // setTimeout(() => {
        //   BinanceWebSocket.unsubscribe(callback);
        //   reject(new Error('Timeout while waiting for exchange rate data'));
        // }, 10000); // 10 seconds timeout
      });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch exchange rate data');
    }
  }
);

const exchangeRateSlice = createSlice({
  name: 'exchangeRate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRate.fulfilled, (state, action) => {
        state.loading = false;
        state.rate = action.payload.rate;
        state.warning = action.payload.warning;
      })
      .addCase(fetchExchangeRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default exchangeRateSlice.reducer;
