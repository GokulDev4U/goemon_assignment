// src/features/orderBookSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import WebSocketService from '../services/websocketService';

interface OrderBookState {
  bidOrders: { price: string; volume: string }[];
  askOrders: { price: string; volume: string }[];
  slippage: string;
  priceImpact: string;
  fees: string;
  percentageChange: string;
  loading: boolean;
  error: string | null;
}

interface OrderBookPayload {
  bidOrders: { price: string; volume: string }[];
  askOrders: { price: string; volume: string }[];
  slippage: string;
  priceImpact: string;
  fees: string;
  percentageChange: string;
}

const initialState: OrderBookState = {
  bidOrders: [],
  askOrders: [],
  slippage: '',
  priceImpact: '',
  fees: '',
  percentageChange: '',
  loading: false,
  error: null,
};

interface AsyncThunkConfig {
  rejectValue: string;
}

// Async thunk to fetch real-time order book data
export const fetchOrderBook = createAsyncThunk<OrderBookPayload, void, AsyncThunkConfig>(
  'orderBook/fetchOrderBook',
  async (_, { rejectWithValue }) => {
    try {
      const orderBookData: OrderBookPayload = await new Promise((resolve, reject) => {
        WebSocketService.subscribeToBinanceOrderBook('ETH-USDT', (data: any) => {
          
          if (data && data.bidOrders && data.askOrders) {
            resolve({
              bidOrders: data.bidOrders.map((order: any) => ({
                price: order.price.toString(),
                volume: order.volume.toString(),
              })),
              askOrders: data.askOrders.map((order: any) => ({
                price: order.price.toString(),
                volume: order.volume.toString(),
              })),
              slippage: data.slippage || '',
              priceImpact: data.priceImpact || '',
              fees: data.fees || '',
              percentageChange: data.percentageChange || '',
            });
          } else {
            reject(new Error('Invalid order book data received from WebSocket'));
          }
        });
      });

      return orderBookData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order book data');
    }
  }
);

const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    setOrderBookData: (state, action) => {
      const { bidOrders, askOrders, slippage, priceImpact, fees, percentageChange } = action.payload;
      state.bidOrders = bidOrders;
      state.askOrders = askOrders;
      state.slippage = slippage;
      state.priceImpact = priceImpact;
      state.fees = fees;
      state.percentageChange = percentageChange;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderBook.fulfilled, (state, action) => {
        state.loading = false;
        state.bidOrders = action.payload.bidOrders;
        state.askOrders = action.payload.askOrders;
        state.slippage = action.payload.slippage;
        state.priceImpact = action.payload.priceImpact;
        state.fees = action.payload.fees;
        state.percentageChange = action.payload.percentageChange;
      })
      .addCase(fetchOrderBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setOrderBookData } = orderBookSlice.actions;
export default orderBookSlice.reducer;

