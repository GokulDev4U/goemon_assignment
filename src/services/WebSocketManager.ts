class WebSocketManager {
  private socket: WebSocket | null = null;
  private messageListeners: Set<(data: any) => void> = new Set();

  constructor(private url: string) {}

  connect() {
    if (this.socket) return;

    this.socket = new WebSocket(this.url);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageListeners.forEach((listener) => listener(data));
    };

    this.socket.onerror = (error) => {
      console.error(`WebSocket Error on ${this.url}:`, error);
    };

    this.socket.onclose = () => {
      console.log(`WebSocket closed for ${this.url}`);
      this.socket = null;
    };
  }

  addListener(callback: (data: any) => void) {
    this.messageListeners.add(callback);
  }

  removeListener(callback: (data: any) => void) {
    this.messageListeners.delete(callback);

    if (this.messageListeners.size === 0) {
      this.close();
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default WebSocketManager;
