// // src/services/websocketService.ts
import { io } from 'socket.io-client';

// class WebSocketService {
//   private socket: any;

//   constructor() {
//     this.socket = io('wss://mock-trading-api.com');  // Replace with actual WebSocket API endpoint
//   }

//   subscribeToOrderBook(symbol: string, callback: Function) {
//     this.socket.emit('subscribe', symbol);
//     this.socket.on('orderBookUpdate', (data: any) => {
//       callback(data); // Pass the data to update the state
//     });
//   }

//   unsubscribeFromOrderBook() {
//     this.socket.emit('unsubscribe');
//   }
// }

// export default new WebSocketService();


// src/services/websocketService.ts

class WebSocketService {
  private socket: WebSocket | null = null;

  subscribeToBinanceOrderBook(pair: string, onMessage: (data: any) => void): void {
    const streamName = `${pair.toLowerCase()}@depth@100ms`; // Depth stream with 100ms update
    const binanceWebSocketURL = `wss://stream.binance.com:9443/ws/${streamName}`;

    this.socket = new WebSocket(binanceWebSocketURL);

    this.socket.onopen = () => {
      console.log(`Connected to Binance WebSocket for pair: ${pair}`);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log(`WebSocket connection closed for pair: ${pair}`);
    };
  }

  unsubscribe(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default new WebSocketService();
