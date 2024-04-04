import cls from "./canvas.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { drawBorder, holes, ball } from "./ui/canvasUtils/canvasUtils";
import useMouseTracker from "./ui/mouseTracker/MouseTracker";
import { ballCollorData, ballPositionData } from "./ui/canvasData/canvasData";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [ballPosition, setBallPosition] = useState(ballPositionData);
  const mousePos = useMouseTracker(canvasRef);
  const [stopChecking, setStopChecking] = useState(false);
  const [isColorSelectWin, setColorSelectWin] = useState(false);
  const [isChosenBall, setChosenBall] = useState(0);

  const handleColorSelect = (ballColor: number) => {
    setColorSelectWin(false);
    const updatedBallPosition = [...ballPosition];
    updatedBallPosition[isChosenBall] = {
      ...updatedBallPosition[isChosenBall],
      color: ballCollorData[ballColor],
    };
    setBallPosition(updatedBallPosition);
  };

  useEffect(() => {
    if (mousePos.LeftBut && !stopChecking) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { width: canvasWidth, height: canvasHeight } =
        canvas.getBoundingClientRect();
      const { x: clickX, y: clickY } = mousePos;

      let cursorInsideAnyBall = false;

      ballPosition.forEach((val, ind) => {
        const recalculatedX = (val.x + 50) / (canvas.width / canvasWidth);
        const recalculatedY = (val.y + 50) / (canvas.height / canvasHeight);
        const ballRadius = 10 / (canvas.width / canvasWidth);

        const distanceToCursor = Math.sqrt(
          (clickX - recalculatedX) ** 2 + (clickY - recalculatedY) ** 2
        );

        if (distanceToCursor <= ballRadius) {
          setColorSelectWin(true);
          setChosenBall(ind);
          cursorInsideAnyBall = true;
        }
      });

      if (!cursorInsideAnyBall) {
        ballPosition.forEach((val, ind) => {
          const recalculatedX = (val.x + 50) / (canvas.width / canvasWidth);
          const recalculatedY = (val.y + 50) / (canvas.height / canvasHeight);
          const ballRadius = 21 / (canvas.width / canvasWidth);

          const distanceToCursor = Math.sqrt(
            (clickX - recalculatedX) ** 2 + (clickY - recalculatedY) ** 2
          );

          if (distanceToCursor <= ballRadius * 1.1 && mousePos.LeftBut) {
            const newSpeedX =
              mousePos.directionX === "right"
                ? mousePos.speedX
                : -mousePos.speedX;
            const newSpeedY =
              mousePos.directionY === "down"
                ? mousePos.speedY
                : -mousePos.speedY;

            const newBallPosition = [...ballPosition];
            newBallPosition[ind] = {
              ...newBallPosition[ind],
              speedX: newSpeedX,
              speedY: newSpeedY,
            };
            setBallPosition(newBallPosition);

            setStopChecking(true);
            setTimeout(() => setStopChecking(false), 1000);
          }
        });
      }
    }
  }, [mousePos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseEnter = () => {
      canvas.style.cursor = "crosshair";
    };

    const handleMouseLeave = () => {
      canvas.style.cursor = "default";
    };

    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [canvasRef]);

  const checkHoleCollision = useCallback(() => {
    setBallPosition((prevPositions) => {
      const newPosition = prevPositions.map((vPos) => {
        const canvas = canvasRef.current;
        if (!canvas) {
          return vPos;
        }

        const holeRadius = 10;
        const holePositions = [
          { x: -20, y: -20 },
          { x: -20, y: canvas.height / 2 - 20 },
          { x: -20, y: canvas.height - 100 },
          { x: canvas.width - 100, y: -20 },
          { x: canvas.width - 100, y: canvas.height / 2 - 80 },
          { x: canvas.width - 100, y: canvas.height - 100 },
        ];

        holePositions.forEach((holePos) => {
          const dx = vPos.x - holePos.x;
          const dy = vPos.y - holePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= holeRadius + 25) {
            vPos.show = false;
          }
        });

        return vPos;
      });
      return newPosition;
    });
  }, [canvasRef]);

  const moveBall = useCallback(() => {
    checkHoleCollision();
    setBallPosition((prevPositions) => {
      const newPosition = prevPositions.map((vPos, index) => {
        if (!vPos.show) {
          return vPos; // Если шар скрыт, пропускаем его
        }

        let newX = vPos.x + vPos.speedX;
        let newY = vPos.y + vPos.speedY;
        const speedFR = 0.001;
        let newSpX =
          vPos.speedX > speedFR ? vPos.speedX - speedFR : vPos.speedX;
        let newSpY =
          vPos.speedY > speedFR ? vPos.speedY - speedFR : vPos.speedY;

        const canvas = canvasRef.current;
        if (canvas) {
          if (newX >= canvas.width - 100 || newX <= 0) {
            vPos.speedX *= -1;
          }
          if (newY >= canvas.height - 100 || newY <= 0) {
            vPos.speedY *= -1;
          }
          prevPositions.forEach((otherPos, otherIndex) => {
            if (otherIndex !== index && otherPos.show) {
              const dx = newX - otherPos.x;
              const dy = newY - otherPos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < 40) {
                const moveX = dx * 0.05;
                const moveY = dy * 0.05;

                newX += moveX / 6;
                newY += moveY / 6;
                prevPositions[otherIndex].x -= moveX / 6;
                prevPositions[otherIndex].y -= moveY / 6;

                const angle = Math.atan2(dy, dx);

                const newSpeed =
                  Math.sqrt(
                    (vPos.speedX + otherPos.speedX) *
                      (vPos.speedX + otherPos.speedX) +
                      (vPos.speedY + otherPos.speedY) *
                        (vPos.speedY + otherPos.speedY)
                  ) * 0.5;

                vPos.speedX = Math.cos(angle) * newSpeed;
                vPos.speedY = Math.sin(angle) * newSpeed;
                prevPositions[otherIndex].speedX =
                  Math.cos(angle + Math.PI) * newSpeed;
                prevPositions[otherIndex].speedY =
                  Math.sin(angle + Math.PI) * newSpeed;
              }
            }
          });
        }

        return {
          ...vPos,
          x: newX,
          y: newY,
          speedX: newSpX,
          speedY: newSpY,
        };
      });

      return newPosition;
    });
  }, [canvasRef, checkHoleCollision]);

  useEffect(() => {
    const intervalId = setInterval(moveBall, 1);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    moveBall();
  }, [moveBall]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBorder(context, "#3e1e00", 60, canvas.width, canvas.height);
    holes(context, canvas);
    ballPosition.map((val) =>
      val.show ? ball(context, val.x + 50, val.y + 50, val.color) : null
    );
  }, [ballPosition]);

  return (
    <div className={cls.canvasWin}>
      <canvas className={cls.canvas} ref={canvasRef} width={500} height={800} />
      <div
        className={`${cls.colorSelectWin} ${isColorSelectWin ? "" : cls.hide}`}
      >
        {ballCollorData.map((val, ind) => (
          <button
            key={ind}
            className={cls.colorBall}
            style={{ backgroundColor: val }}
            onClick={() => handleColorSelect(ind)}
          >
            &nbsp;
          </button>
        ))}
        <button onClick={() => setColorSelectWin(false)}>&#128683;</button>
      </div>
    </div>
  );
};

export default Canvas;
