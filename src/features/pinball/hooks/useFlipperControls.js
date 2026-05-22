import { useState, useEffect, useRef } from "react";
import { Quaternion } from "three";
import { useSound } from "./useSound";

export function useFlipperControls() {
  const { play } = useSound();

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

  useEffect(() => {
    const onDown = (e) => {
      if (e.code === "ArrowRight") {
        setActiveFlippers((p) => ({
          ...p,
          right: true,
          right2: true,
        }));

        play("flippers");
      }

      if (e.code === "ArrowLeft") {
        setActiveFlippers((p) => ({
          ...p,
          left: true,
        }));

        play("flippers");
      }
    };

    const onUp = (e) => {
      if (e.code === "ArrowRight") {
        setActiveFlippers((p) => ({
          ...p,
          right: false,
          right2: false,
        }));
      }

      if (e.code === "ArrowLeft") {
        setActiveFlippers((p) => ({
          ...p,
          left: false,
        }));
      }
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    return () => {
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
