import WebSocketManager from './WebSocketManager';

class BinanceWebSocket extends WebSocketManager {
  private lastFetchedPrice: number | null = null; // Store the last fetched price for validation

  constructor() {
    super('wss://stream.binance.com:9443/ws/ethusdt@depth');
  }

  calculateMetrics(bidOrders: any[], askOrders: any[]) {
    if (bidOrders.length === 0 || askOrders.length === 0) {
      return {
        slippage: '0',
        priceImpact: '0',
        fees: '0',
        percentageChange: '0',
        warning: null,
      };
    }

    const highestBid = parseFloat(bidOrders[0].price);
    const lowestAsk = parseFloat(askOrders[0].price);

    // Calculate metrics
    const slippage = (((lowestAsk - highestBid) / highestBid) * 100).toFixed(2);
    const priceImpact = (Math.random() * 0.5).toFixed(2); // Mock price impact
    const fees = (lowestAsk * 0.001).toFixed(2); // 0.1% fees
    const percentageChange = (((lowestAsk - highestBid) / highestBid) * 100).toFixed(2);

    // Check for slippage warning (if it exceeds 1% of the last fetched price)
    const warning =
      this.lastFetchedPrice && Math.abs(parseFloat(slippage)) > 1
        ? `Slippage exceeds 1%! Be cautious.`
        : null;

    // Update the last fetched price for next validation
    this.lastFetchedPrice = lowestAsk;

    return { slippage, priceImpact, fees, percentageChange, warning, highestBid , lowestAsk};
  }

  parseOrderBook(data: any, callback: (parsedData: any) => void) {
    if (data && data.a && data.b) {
      console.log('data', data)
      const bidOrders = data.a.map((order: any) => ({ price: order[0], volume: order[1] }));
      const askOrders = data.b.map((order: any) => ({ price: order[0], volume: order[1] }));

      const metrics = this.calculateMetrics(bidOrders, askOrders);

      callback({
        bidOrders,
        askOrders,
        ...metrics,
      });
    }
  }

  subscribe(callback: (data: any) => void) {
    this.connect();
    this.addListener((data) => this.parseOrderBook(data, callback));
  }

  unsubscribe(callback: (data: any) => void) {
    this.removeListener((data) => this.parseOrderBook(data, callback));
    // this.disconnect(); // Ensure WebSocket connection is closed when unsubscribed
  }
}

// export default new BinanceWebSocket();
const binanceWebSocketInstance = new BinanceWebSocket();
export default binanceWebSocketInstance;


// import WebSocketManager from './WebSocketManager';
// import { AppDispatch } from '../features/store'; // Ensure you have the correct dispatch type
// import { fetchOrderBook } from '../features/orderBookSlice';

// class BinanceWebSocket extends WebSocketManager {
//   private lastFetchedPrice: number | null = null;
//   private exchangeRateTimer: NodeJS.Timeout | null = null;
//   private orderBookTimer: NodeJS.Timeout | null = null;
//   private dispatch: AppDispatch; // Add dispatch here
//   private listeners: Array<(data: any) => void> = []; // Store listeners for unsubscribe

//   constructor(dispatch: AppDispatch) {
//     super('wss://stream.binance.com:9443/ws/ethusdt@depth');
//     this.dispatch = dispatch;
//     this.startExchangeRateFetch();
//     this.startOrderBookFetch();
//   }

//   startExchangeRateFetch() {
//     if (this.exchangeRateTimer) {
//       clearInterval(this.exchangeRateTimer);
//     }
//     this.exchangeRateTimer = setInterval(() => {
//       this.fetchExchangeRates();
//     }, 5000);
//   }

//   startOrderBookFetch() {
//     if (this.orderBookTimer) {
//       clearInterval(this.orderBookTimer);
//     }
//     this.orderBookTimer = setInterval(() => {
//       this.fetchOrderBookData();
//     }, 2000);
//   }

//   fetchExchangeRates() {
//     // Your code here
//   }

//   fetchOrderBookData() {
//     console.log('Fetching order book data...');
//     // You should call this in the WebSocket listener to update the Redux state
//     this.dispatch(fetchOrderBook());
//   }

//   calculateMetrics(bidOrders: any[], askOrders: any[]) {
//     if (bidOrders.length === 0 || askOrders.length === 0) {
//       return {
//         slippage: '0',
//         priceImpact: '0',
//         fees: '0',
//         percentageChange: '0',
//         warning: null,
//       };
//     }

//     const highestBid = parseFloat(bidOrders[0].price);
//     const lowestAsk = parseFloat(askOrders[0].price);

//     const slippage = (((lowestAsk - highestBid) / highestBid) * 100).toFixed(2);
//     const priceImpact = (Math.random() * 0.5).toFixed(2); // Mock price impact
//     const fees = (lowestAsk * 0.001).toFixed(2);
//     const percentageChange = (((lowestAsk - highestBid) / highestBid) * 100).toFixed(2);

//     const warning =
//       this.lastFetchedPrice && Math.abs(parseFloat(slippage)) > 1
//         ? `Slippage exceeds 1%! Be cautious.`
//         : null;

//     this.lastFetchedPrice = lowestAsk;

//     return { slippage, priceImpact, fees, percentageChange, warning, highestBid, lowestAsk };
//   }

//   parseOrderBook(data: any, callback: (parsedData: any) => void) {
//     if (data && data.a && data.b) {
//       const bidOrders = data.a.map((order: any) => ({ price: order[0], volume: order[1] }));
//       const askOrders = data.b.map((order: any) => ({ price: order[0], volume: order[1] }));

//       const metrics = this.calculateMetrics(bidOrders, askOrders);

//       callback({
//         bidOrders,
//         askOrders,
//         ...metrics,
//       });

//       // Dispatch the fetched order book data to Redux here
//       this.dispatch({
//         type: 'orderBook/setOrderBookData',
//         payload: {
//           bidOrders,
//           askOrders,
//           ...metrics,
//         },
//       });
//     }
//   }

//   subscribe(callback: (data: any) => void) {
//     this.connect();
//     this.listeners.push(callback); // Save the callback to a listener list
//     this.addListener((data) => this.parseOrderBook(data, callback));
//   }

//   unsubscribe(callback: (data: any) => void) {
//     this.listeners = this.listeners.filter((listener) => listener !== callback); // Remove listener from the list
//     if (this.listeners.length === 0) {
//       this.removeListener((data) => this.parseOrderBook(data, callback)); // Remove the listener if no listeners remain
//       // this.disconnect(); // Disconnect WebSocket if no active listeners
//     }
//   }

//   stopFetching() {
//     if (this.exchangeRateTimer) {
//       clearInterval(this.exchangeRateTimer);
//     }
//     if (this.orderBookTimer) {
//       clearInterval(this.orderBookTimer);
//     }
//   }
// }

// // Now you can create an instance of BinanceWebSocket and pass dispatch to it
// // const binanceWebSocketInstance = new BinanceWebSocket(dispatch);
// // export default binanceWebSocketInstance;
// export default BinanceWebSocket;

