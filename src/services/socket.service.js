const ESP32_URL = "ws://localhost:3000/esp32";
const SCREENS_URL = "ws://localhost:3000/screens";

class WebSocketService {
  constructor() {
    this.esp32 = null;
    this.screens = null;
    this.listeners = [];
    this.screenListeners = [];
  }

  connect() {
    this.esp32 = new WebSocket(ESP32_URL);
    this.esp32.onopen = () => console.log("[ESP32] connecté");
    this.esp32.onclose = () => console.log("[ESP32] déco");
    this.esp32.onerror = (e) => console.error("[ESP32] Erreur", e);
    this.esp32.onmessage = (e) => {
      const data = JSON.parse(e.data);
      this.listeners.forEach((cb) => cb(data));
    };

    this.screens = new WebSocket(SCREENS_URL);
    this.screens.onopen = () => console.log("[Screens] connecté");
    this.screens.onclose = () => console.log("[Screens] déco");
    this.screens.onerror = (e) => console.error("[Screens] Erreur", e);
    this.screens.onmessage = (e) => {
      const data = JSON.parse(e.data);
      this.screenListeners.forEach((cb) => cb(data));
    };
  }

  onMessage(callback) {
    this.listeners.push(callback);
  }

  onScreenMessage(callback) {
    this.screenListeners.push(callback);
  }

  startGame(playerName) {
    if (this.screens?.readyState === WebSocket.OPEN) {
      this.screens.send(JSON.stringify({ type: "start_game", playerName }));
    }
  }

  emitScore(points) {
    if (this.screens?.readyState === WebSocket.OPEN) {
      this.screens.send(JSON.stringify({ type: "hit", points }));
    } else {
      console.log(`[socket non co] score local : +${points} pts`);
    }
  }

  emitBallLost() {
    if (this.screens?.readyState === WebSocket.OPEN) {
      this.screens.send(JSON.stringify({ type: "ball_lost" }));
    }
  }

  disconnect() {
    this.esp32?.close();
    this.screens?.close();
    this.listeners = [];
    this.screenListeners = [];
  }
}

const wsService = new WebSocketService();
export default wsService;
