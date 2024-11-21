// src/services/websocketService.ts

class WebSocketService {
  private socket: WebSocket;

  constructor() {
    // WebSocket URL for Binance Depth Stream (order book updates)
    this.socket = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@depth');  
  }

  subscribeToOrderBook(callback: Function) {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // The structure contains bid and ask orders
      if (data && data.a && data.b) {
        const bidOrders = data.a.map((order: any) => ({
          price: order[0],  // Bid price
          volume: order[1], // Bid volume
        }));

        const askOrders = data.b.map((order: any) => ({
          price: order[0],  // Ask price
          volume: order[1], // Ask volume
        }));

        // Pass the order book data to the callback
        callback({
          bidOrders,
          askOrders,
        });
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }

  unsubscribe() {
    this.socket.close();  // Close the WebSocket connection
  }
}

export default new WebSocketService();

