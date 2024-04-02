import { useEffect, useState, RefObject } from "react";

interface MouseTp {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  LeftBut: boolean;
}

const useMouseTracker = (canvasRef: RefObject<HTMLCanvasElement>) => {
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

      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const canvasRect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;

      setMousePos({
        x: mouseX,
        y: mouseY,
        speedX,
        speedY,
        LeftBut: event.buttons === 1, // 1 represents the left mouse button being pressed
      });

      setPrevMousePos({
        x: mouseX,
        y: mouseY,
        time: currentTime,
        LeftBut: event.buttons === 1,
      });
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.buttons === 1) {
        // Check if left mouse button is pressed
        handleMouseEvent(event);
      }
    };

    document.addEventListener("mousemove", handleMouseEvent);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseEvent);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [canvasRef, prevMousePos]);

  return mousePos;
};

export default useMouseTracker;
