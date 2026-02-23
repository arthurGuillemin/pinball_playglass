const ESP32_URL = "ws://localhost:3000/esp32";
const SCREENS_URL = "ws://localhost:3000/screens";

class WebSocketService {
  constructor() {
    this.esp32 = null;
    this.screens = null;
    this.listeners = [];
  }

  connect() {
    this.esp32 = new WebSocket(ESP32_URL);
    this.esp32.onopen = () => console.log("[ESP32] connectton au socket");
    this.esp32.onclose = () => console.log("[ESP32] deco du socket");
    this.esp32.onerror = (e) => console.error("[ESP32] Erreur", e);
    this.esp32.onmessage = (e) => {
      const data = JSON.parse(e.data);
      this.listeners.forEach((cb) => cb(data));
    };

    this.screens = new WebSocket(SCREENS_URL);
    this.screens.onopen = () => console.log("[Screens] connecté au socket");
    this.screens.onclose = () => console.log("[Screens] deco");
    this.screens.onerror = (e) => console.error("[Screens] Erreur", e);
  }

  onMessage(callback) {
    this.listeners.push(callback);
  }

  emitScore(points) {
    if (this.screens?.readyState === WebSocket.OPEN) {
      this.screens.send(JSON.stringify({ type: "hit", points }));
    } else {
      console.log(`[socket non co] score local : +${points} pts`);
    }
  }

  disconnect() {
    this.esp32?.close();
    this.screens?.close();
    this.listeners = [];
  }
}

const wsService = new WebSocketService();
export default wsService;
