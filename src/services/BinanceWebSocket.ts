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
