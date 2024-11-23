// src/services/websocketService.ts

const calculateMetrics = (bidOrders: any[], askOrders: any[]) => {
  if (bidOrders.length === 0 || askOrders.length === 0) {
    return {
      slippage: '0',
      priceImpact: '0',
      fees: '0',
      percentageChange: '0',
    };
  }

  const highestBid = parseFloat(bidOrders[0].price);
  const lowestAsk = parseFloat(askOrders[0].price);

  // Mock calculations
  const slippage = (((lowestAsk - highestBid) / highestBid) * 100).toFixed(2); // % difference
  const priceImpact = (Math.random() * 0.5).toFixed(2); // Example value
  const fees = (lowestAsk * 0.001).toFixed(2); // Assuming 0.1% fee
  const percentageChange = (((lowestAsk - highestBid) / highestBid) * 100).toFixed(2);

  return { slippage, priceImpact, fees, percentageChange };
};

class WebSocketService {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@depth');
  }

  subscribeToOrderBook(callback: Function) {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // The structure contains bid and ask orders
      if (data && data.a && data.b) {
        const bidOrders = data.a.map((order: any) => ({
          price: order[0], // Bid price
          volume: order[1], // Bid volume
        }));

        const askOrders = data.b.map((order: any) => ({
          price: order[0], // Ask price
          volume: order[1], // Ask volume
        }));

        const metrics = calculateMetrics(bidOrders, askOrders);

        callback({
          bidOrders,
          askOrders,
          ...metrics,
        });
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }

  unsubscribe() {
    this.socket.close();
  }
}

// Assign the instance to a variable and export it
const websocketServiceInstance = new WebSocketService();
export default websocketServiceInstance;
