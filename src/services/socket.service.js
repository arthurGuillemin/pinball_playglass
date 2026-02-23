const WS_URL = "ws://localhost:3000/esp32";

class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = [];
  }

  connect() {
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => console.log("WS connecté");
    this.ws.onclose = () => console.log("WS déconnecté");
    this.ws.onerror = (e) => console.error("WS erreur", e);

    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      this.listeners.forEach((cb) => cb(data));
    };
  }

  onMessage(callback) {
    this.listeners.push(callback);
  }

  disconnect() {
    this.ws?.close();
    this.listeners = [];
  }
}
export const emitScore = (points) => {
  console.log(`[Socket non co] score local : +${points} pts`);
};

const wsService = new WebSocketService();
export default wsService;
