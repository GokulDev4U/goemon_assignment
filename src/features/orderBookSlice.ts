// src/features/orderBookSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BinanceWebSocket from '../services/BinanceWebSocket';
// import WebSocketService from '../services/websocketService';

interface OrderBookState {
  bidOrders: { price: string; volume: string }[];
  askOrders: { price: string; volume: string }[];
  slippage?: string;
  priceImpact?: string;
  fees?: string;
  percentageChange?: string;
  warning: string | null,
  previousBidPrice: number ,
  previousAskPrice: number ,
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
  warning: null,
  previousBidPrice: number ,
  previousAskPrice: number ,
}

const initialState: OrderBookState = {
  bidOrders: [],
  askOrders: [],
  slippage: '',
  priceImpact: '',
  fees: '',
  percentageChange: '',
  warning: null,
  previousBidPrice: 0 ,
  previousAskPrice: 0 ,
  loading: false,
  error: null,
};

interface AsyncThunkConfig {
  rejectValue: string;
}

// Async thunk to fetch real-time order book data
// export const fetchOrderBook = createAsyncThunk<OrderBookPayload, void, AsyncThunkConfig>(
//   'orderBook/fetchOrderBook',
//   async (_, { rejectWithValue }) => {
//     try {
//       return new Promise((resolve, reject) => {
//         WebSocketService.subscribeToOrderBook((data: any) => {
//           if (data && data.bidOrders && data.askOrders) {
//             // console.log('data.bidOrders', data.bidOrders)
//             // console.log('data.askOrders', data.askOrders)
//             resolve({
//               bidOrders: data.bidOrders.map((order: any) => ({
//                 price: order.price.toString(),
//                 volume: order.volume.toString(),
//               })),
//               askOrders: data.askOrders.map((order: any) => ({
//                 price: order.price.toString(),
//                 volume: order.volume.toString(),
//               })),
//               slippage: data.slippage,
//               priceImpact: data.priceImpact,
//               fees: data.fees,
//               percentageChange: data.percentageChange,
//               warning : data.warning
//             });
//           } else {
//             reject(new Error('Invalid order book data received from WebSocket'));
//           }
//         });
//       });
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Failed to fetch order book data');
//     }
//   }
// );

export const fetchOrderBook = createAsyncThunk<OrderBookPayload, void, AsyncThunkConfig>(
  'orderBook/fetchOrderBook',
  async (_, { rejectWithValue }) => {
    try {
      return new Promise<OrderBookPayload>((resolve, reject) => {
        // Subscribe to the WebSocket and process incoming data
        const callback = (data: any) => {
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
              slippage: data.slippage,
              priceImpact: data.priceImpact,
              fees: data.fees,
              percentageChange: data.percentageChange,
              warning: data.warning,
              previousBidPrice: data.highestBid ,
              previousAskPrice: data.lowestAsk
            });

            // Unsubscribe after receiving valid data to prevent indefinite listening
            BinanceWebSocket.unsubscribe(callback);
          } else {
            reject(new Error('Invalid order book data received from WebSocket'));
          }
        };

        BinanceWebSocket.subscribe(callback);

        // Optionally, add a timeout to handle cases where no data is received
        // setTimeout(() => {
        //   BinanceWebSocket.unsubscribe(callback);
        //   reject(new Error('Timeout while waiting for order book data'));
        // }, 10000); // 10 seconds timeout
      });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order book data');
    }
  }
);

const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    // setOrderBookData: (state, action) => {
    //   const { bidOrders, askOrders, slippage, priceImpact, fees, percentageChange } = action.payload;
    //   state.bidOrders = bidOrders;
    //   state.askOrders = askOrders;
    //   state.slippage = slippage;
    //   state.priceImpact = priceImpact;
    //   state.fees = fees;
    //   state.percentageChange = percentageChange;
    // },
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
        state.warning = action.payload.warning;
        state.previousBidPrice = action.payload.previousBidPrice;
        state.previousAskPrice = action.payload.previousAskPrice;
      })
      .addCase(fetchOrderBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// export const { setOrderBookData } = orderBookSlice.actions;
export default orderBookSlice.reducer;

