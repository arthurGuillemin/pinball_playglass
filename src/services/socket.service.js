const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";

class SocketService {
  constructor() {
    this.screens = null;
    this.esp32 = null;
    this.screenListeners = new Set();
    this.esp32Listeners = new Set();
  }

  connect() {
    if (this.screens?.readyState === WebSocket.OPEN) return;

    this.screens = new WebSocket(`${WS_URL}/screens`);
    this.screens.onopen = () => console.log("[Screens] connecté ✅");
    this.screens.onclose = () => console.log("[Screens] déconnecté");
    this.screens.onerror = (e) => console.error("[Screens] erreur", e);
    this.screens.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        this.screenListeners.forEach((cb) => cb(data));
      } catch (err) {
        console.error("[Screens] parsing error", err);
      }
    };

    this.esp32 = new WebSocket(`${WS_URL}/esp32`);
    this.esp32.onopen = () => console.log("[ESP32] connecté ✅");
    this.esp32.onclose = () => console.log("[ESP32] déconnecté");
    this.esp32.onerror = (e) => console.error("[ESP32] erreur", e);
    this.esp32.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        this.esp32Listeners.forEach((cb) => cb(data));
      } catch (err) {
        console.error("[ESP32] parsing error", err);
      }
    };
  }

  // Retourne une fonction de cleanup pour utilisation dans useEffect
  onScreenMessage(cb) {
    this.screenListeners.add(cb);
    return () => this.screenListeners.delete(cb);
  }

  onEsp32Message(cb) {
    this.esp32Listeners.add(cb);
    return () => this.esp32Listeners.delete(cb);
  }

  send(type, payload = {}) {
    if (this.screens?.readyState === WebSocket.OPEN) {
      this.screens.send(JSON.stringify({ type, ...payload }));
    } else {
      console.warn(`[Screens] non connecté, message "${type}" ignoré`);
    }
  }

  disconnect() {
    this.screens?.close();
    this.esp32?.close();
    this.screens = null;
    this.esp32 = null;
    this.screenListeners.clear();
    this.esp32Listeners.clear();
  }
}

const socketService = new SocketService();
export default socketService;
