import React, { useEffect, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

const MouseTracker: React.FC = () => {
  const [mousePos, setMousePos] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [isLeftButtonPressed, setIsLeftButtonPressed] =
    useState<boolean>(false);

  useEffect(() => {
    const handleMouseEvent = (event: MouseEvent) => {
      setMousePos({
        x: event.clientX,
        y: event.clientY,
      });
      if (event.type === "mousedown" && event.button === 0) {
        setIsLeftButtonPressed(true);
      } else if (event.type === "mouseup") {
        setIsLeftButtonPressed(false);
      }
      console.log("Mouse position:", mousePos);
      console.log("Left button pressed:", isLeftButtonPressed);
    };

    document.addEventListener("mousemove", handleMouseEvent);
    document.addEventListener("mousedown", handleMouseEvent);
    document.addEventListener("mouseup", handleMouseEvent);

    return () => {
      document.removeEventListener("mousemove", handleMouseEvent);
      document.removeEventListener("mousedown", handleMouseEvent);
      document.removeEventListener("mouseup", handleMouseEvent);
    };
  }, [mousePos, isLeftButtonPressed]);

  return null;
};

export default MouseTracker;
