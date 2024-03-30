import { useEffect, useState } from "react";

interface MouseTp {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  LeftBut: boolean;
}

const useMouseTracker = () => {
  const [mousePos, setMousePos] = useState<MouseTp>({
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
    LeftBut: false,
  });
  const [prevMousePos, setPrevMousePos] = useState<{
    x: number;
    y: number;
    time: number;
    LeftBut: boolean;
  } | null>(null);

  useEffect(() => {
    const handleMouseEvent = (event: MouseEvent) => {
      const currentTime = new Date().getTime();
      const deltaTime = prevMousePos
        ? (currentTime - prevMousePos.time) / 1000
        : 0;

      const speedX = prevMousePos
        ? (event.clientX - prevMousePos.x) / deltaTime / 1000
        : 0;
      const speedY = prevMousePos
        ? (event.clientY - prevMousePos.y) / deltaTime / 1000
        : 0;

      setMousePos({
        x: event.clientX,
        y: event.clientY,
        speedX,
        speedY,
        LeftBut: event.buttons === 1, // 1 represents the left mouse button being pressed
      });

      setPrevMousePos({
        x: event.clientX,
        y: event.clientY,
        time: currentTime,
        LeftBut: event.buttons === 1,
      });
    };

    document.addEventListener("mousemove", handleMouseEvent);

    return () => {
      document.removeEventListener("mousemove", handleMouseEvent);
    };
  }, [prevMousePos]);

  return mousePos;
};

export default useMouseTracker;
