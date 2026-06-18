import { useState, useEffect, useRef } from "react";
import { Quaternion } from "three";
import mqtt from "mqtt";
import { useSound } from "./useSound";
import { MAX_CHARGE_TIME, MAX_VELOCITY } from "../constants/ballConfig";

export function useFlipperControls() {
  const rightRef = useRef(null);
  const leftRef = useRef(null);
  const right2Ref = useRef(null);
  const rightRot = useRef(new Quaternion());
  const leftRot = useRef(new Quaternion());
  const right2Rot = useRef(new Quaternion());
  const [activeFlippers, setActiveFlippers] = useState({
    right: false,
    left: false,
    right2: false,
  });

  const { play } = useSound();

  // Simule un appui chargé depuis une durée en ms (vient du MQTT LAUNCH_UP:<ms>)
  function triggerLaunchFromDuration(durationMs) {
    const ratio = Math.min(durationMs / MAX_CHARGE_TIME, 1);
    const speed = 0.5 + ratio * (MAX_VELOCITY - 0.5);

    // On émet d'abord ball-charge pour que l'UI sache qu'on charge
    window.dispatchEvent(
      new CustomEvent("ball-charge", {
        detail: { charging: true, level: ratio },
      }),
    );

    // Puis on simule le relâchement immédiatement avec la bonne vélocité
    window.dispatchEvent(
      new CustomEvent("ball-launch-mqtt", { detail: { speed } }),
    );

    window.dispatchEvent(
      new CustomEvent("ball-charge", { detail: { charging: false, level: 0 } }),
    );
  }

  useEffect(() => {
    /*
      MQTT
    */
    const client = mqtt.connect("ws://localhost:9001", {
      username: "arthur",
      password: "1234",
    });

    client.on("connect", () => {
      console.log("✅ MQTT connected");
      client.subscribe("pinball/flippers", (err) => {
        if (err) {
          console.error("❌ Subscribe error", err);
        } else {
          console.log("📡 Listening pinball/flippers");
        }
      });
    });

    client.on("message", (_, message) => {
      const payload = message.toString();
      console.log("MQTT:", payload);

      // LAUNCH_UP:<durée_ms>
      if (payload.startsWith("LAUNCH_UP:")) {
        const durationMs = parseInt(payload.split(":")[1], 10);
        if (!isNaN(durationMs)) {
          triggerLaunchFromDuration(durationMs);
        }
        return;
      }

      // LAUNCH_DOWN : on peut ignorer ou ajouter un son/feedback visuel
      if (payload === "LAUNCH_DOWN") {
        window.dispatchEvent(
          new CustomEvent("ball-charge", {
            detail: { charging: true, level: 0 },
          }),
        );
        return;
      }

      switch (payload) {
        case "RIGHT_DOWN":
          play("flippersUP");
          setActiveFlippers((p) => ({ ...p, right: true, right2: true }));
          break;
        case "RIGHT_UP":
          play("flippersDOWN");
          setActiveFlippers((p) => ({ ...p, right: false, right2: false }));
          break;
        case "LEFT_DOWN":
          play("flippersUP");
          setActiveFlippers((p) => ({ ...p, left: true }));
          break;
        case "LEFT_UP":
          play("flippersDOWN");
          setActiveFlippers((p) => ({ ...p, left: false }));
          break;
        default:
          break;
      }
    });

    /*
      KEYBOARD
    */
    const onDown = (e) => {
      if (e.code === "ArrowRight") {
        setActiveFlippers((p) => ({ ...p, right: true, right2: true }));
      }
      if (e.code === "ArrowLeft") {
        setActiveFlippers((p) => ({ ...p, left: true }));
      }
    };

    const onUp = (e) => {
      if (e.code === "ArrowRight") {
        setActiveFlippers((p) => ({ ...p, right: false, right2: false }));
      }
      if (e.code === "ArrowLeft") {
        setActiveFlippers((p) => ({ ...p, left: false }));
      }
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    return () => {
      client.end();
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [play]);

  return {
    rightRef,
    leftRef,
    right2Ref,
    rightRot,
    leftRot,
    right2Rot,
    activeFlippers,
  };
}
