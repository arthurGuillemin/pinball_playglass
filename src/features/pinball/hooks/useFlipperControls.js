import { useState, useEffect, useRef } from "react";
import { Quaternion } from "three";
import mqtt from "mqtt";
import { useSound } from "./useSound";

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
  //temporaire
  const { play } = useSound();
  const password = import.meta.env.MQTTPASSWORD;
  useEffect(() => {
    /*
      MQTT
    */
    const client = mqtt.connect("ws://localhost:9001", {
      username: "arthur",
      password: password,
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
