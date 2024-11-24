import WebSocketManager from './WebSocketManager';

class BinanceExchangeRateWebSocket extends WebSocketManager {
  private lastFetchedRate: number | null = null; 

  constructor() {
    super('wss://stream.binance.com:9443/ws/ethusdt@trade'); 
  }

  calculateExchangeRateChange(currentPrice: number) {
    if (this.lastFetchedRate === null) {
      // First time fetching, no change
      this.lastFetchedRate = currentPrice;
      return { rateChange: '0', warning: null };
    }

    const rateChange = (((currentPrice - this.lastFetchedRate) / this.lastFetchedRate) * 100).toFixed(2);

    // Check for rate change warning (if it exceeds 1%)
    const warning =
      Math.abs(parseFloat(rateChange)) > 1
        ? `Exchange rate change exceeds 1%! Be cautious.`
        : null;

    // Update the last fetched rate for next validation
    this.lastFetchedRate = currentPrice;

    return { rateChange, warning };
  }

  parseExchangeRateData(data: any, callback: (parsedData: any) => void) {
    if (data && data.p) { 
      const currentPrice = parseFloat(data.p); 

      const { rateChange, warning } = this.calculateExchangeRateChange(currentPrice);

      callback({
        currentPrice,
        rateChange,
        warning,
      });
    }
  }

  subscribe(callback: (data: any) => void) {
    this.connect();
    this.addListener((data) => this.parseExchangeRateData(data, callback));
  }

  unsubscribe(callback: (data: any) => void) {
    this.removeListener((data) => this.parseExchangeRateData(data, callback));
    // this.disconnect(); // Optionally disconnect WebSocket when unsubscribed
  }
}

// Create an instance of BinanceExchangeRateWebSocket
const binanceExchangeRateWebSocketInstance = new BinanceExchangeRateWebSocket();
export default binanceExchangeRateWebSocketInstance;
