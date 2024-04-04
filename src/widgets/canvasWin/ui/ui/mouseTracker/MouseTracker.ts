import { useEffect, useState, useRef, RefObject } from "react";

interface MouseTp {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  LeftBut: boolean;
  directionX: string;
  directionY: string;
}

const useMouseTracker = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const [mousePos, setMousePos] = useState<MouseTp>({
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
    LeftBut: false,
    directionX: "none",
    directionY: "none",
  });
  const prevMousePos = useRef<{ x: number; y: number; time: number } | null>(
    null
  );

  useEffect(() => {
    const handleMouseEvent = (event: MouseEvent) => {
      const currentTime = new Date().getTime();
      const deltaTime = prevMousePos.current
        ? (currentTime - prevMousePos.current.time) / 1000
        : 0;

      const speedX = prevMousePos.current
        ? (event.clientX - prevMousePos.current.x) / deltaTime / 10000
        : 0;
      const speedY = prevMousePos.current
        ? (event.clientY - prevMousePos.current.y) / deltaTime / 1000
        : 0;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;

      const directionX = prevMousePos.current
        ? mouseX > prevMousePos.current.x
          ? "right"
          : "left"
        : "none";
      const directionY = prevMousePos.current
        ? mouseY > prevMousePos.current.y
          ? "down"
          : "up"
        : "none";

      setMousePos({
        x: mouseX,
        y: mouseY,
        speedX,
        speedY,
        LeftBut: event.buttons === 1,
        directionX,
        directionY,
      });

      prevMousePos.current = {
        x: mouseX,
        y: mouseY,
        time: currentTime,
      };
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.buttons === 1) {
        handleMouseEvent(event);
      }
    };

    document.addEventListener("mousemove", handleMouseEvent);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseEvent);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [canvasRef]);

  return mousePos;
};

export default useMouseTracker;
