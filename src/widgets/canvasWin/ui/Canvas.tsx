import cls from "./canvas.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { drawBorder, holes, ball } from "./ui/canvasUtils/canvasUtils";
import useMouseTracker from "./ui/mouseTracker/MouseTracker";

type CanvasSize = { width: number; height: number };

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: 500,
    height: 800,
  });

  const [ballPosition, setBallPosition] = useState([
    { color: "#3e1e00", x: 135, y: 102, show: true, speedX: 0, speedY: 0 },
    { color: "#54d53b", x: 178, y: 102, show: true, speedX: 0, speedY: 0 },
    { color: "#115f00", x: 222, y: 102, show: true, speedX: 0, speedY: 0 },
    { color: "#a81616", x: 264, y: 102, show: true, speedX: 0, speedY: 0 },
    { color: "#fcd423", x: 157, y: 140, show: true, speedX: 0, speedY: 0 },
    { color: "#000000", x: 200, y: 140, show: true, speedX: 0, speedY: 0 },
    { color: "#d47979", x: 243, y: 140, show: true, speedX: 0, speedY: 0 },
    { color: "#c47500", x: 178, y: 178, show: true, speedX: 0, speedY: 0 },
    { color: "#0000c4", x: 222, y: 178, show: true, speedX: 0, speedY: 0 },
    { color: "#98009b", x: 200, y: 216, show: true, speedX: 0, speedY: 0 },
    { color: "#e5e5e5", x: 200, y: 600, show: true, speedX: 0, speedY: 0 },
  ]);

  // получение данных курсора  ++++++++++++++++++++++++++++++++++++++++++++++
  const mousePos = useMouseTracker(canvasRef);
  const [stopChecking, setStopChecking] = useState(false);

  useEffect(() => {
    console.log(mousePos);
    if (mousePos.LeftBut && !stopChecking) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { width: canvasWidth, height: canvasHeight } =
        canvas.getBoundingClientRect();
      const { x: clickX, y: clickY } = mousePos;

      let cursorInsideAnyBall = false;

      ballPosition.forEach((val, ind) => {
        const recalculatedX = (val.x + 50) / (canvasSize.width / canvasWidth);
        const recalculatedY = (val.y + 50) / (canvasSize.height / canvasHeight);
        const ballRadius = 20 / (canvasSize.width / canvasWidth);

        const distanceToCursor = Math.sqrt(
          (clickX - recalculatedX) ** 2 + (clickY - recalculatedY) ** 2
        );

        if (distanceToCursor <= ballRadius) {
          console.log("Курсор попал в шар! ++++++++++++++++++", ind);
          cursorInsideAnyBall = true;
        }
      });

      if (!cursorInsideAnyBall) {
        ballPosition.forEach((val, ind) => {
          const recalculatedX = (val.x + 50) / (canvasSize.width / canvasWidth);
          const recalculatedY =
            (val.y + 50) / (canvasSize.height / canvasHeight);
          const ballRadius = 21 / (canvasSize.width / canvasWidth);

          const distanceToCursor = Math.sqrt(
            (clickX - recalculatedX) ** 2 + (clickY - recalculatedY) ** 2
          );

          if (distanceToCursor <= ballRadius * 1.1 && mousePos.LeftBut) {
            console.log(
              "Курсор подведен к шару снаружи.",
              ind,
              mousePos.speedX,
              mousePos.speedY
            );

            // Обновляем скорость шара
            const newBallPosition = [...ballPosition];
            newBallPosition[ind] = {
              ...newBallPosition[ind],
              speedX: mousePos.speedY,
              speedY: mousePos.speedX,
            };
            setBallPosition(newBallPosition);

            setStopChecking(true);
            setTimeout(() => {
              setStopChecking(false);
            }, 1000);
          }
        });
      }
    }
  }, [mousePos]);

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

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

        const holeRadius = 10; // Радиус лунки
        const holePositions = [
          { x: 0, y: 0 }, // Позиция первой лунки
          { x: canvas.width - 35, y: 35 }, // Позиция второй лунки
          { x: 35, y: canvas.height / 2 }, // Позиция третьей лунки
          { x: canvas.width - 35, y: canvas.height / 2 }, // Позиция четвертой лунки
          { x: 35, y: canvas.height - 35 }, // Позиция пятой лунки
          { x: canvas.width - 35, y: canvas.height - 35 }, // Позиция шестой лунки
        ];

        holePositions.forEach((holePos) => {
          const dx = vPos.x - holePos.x;
          const dy = vPos.y - holePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          // Учитываем радиус лунки при проверке столкновения
          if (distance <= holeRadius + 25) {
            // 25 - это радиус шара, т.е. его половина
            vPos.show = false;
          }
        });

        return vPos;
      });
      return newPosition;
    });
  }, [canvasRef]);

  // Функция для обновления координат шара
  const moveBall = useCallback(() => {
    checkHoleCollision(); // Проверяем столкновение с лункой
    setBallPosition((prevPositions) => {
      const newPosition = prevPositions.map((vPos, index) => {
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
          // Проверяем столкновение с другими шарами
          prevPositions.forEach((otherPos, otherIndex) => {
            if (otherIndex !== index && otherPos.show) {
              if (vPos.show && otherPos.show) {
                const dx = vPos.x - otherPos.x;
                const dy = vPos.y - otherPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 40) {
                  // Вычисляем вектор смещения для каждого шара
                  const moveX = dx * 0.05; // Уменьшаем величину смещения
                  const moveY = dy * 0.05; // Уменьшаем величину смещения

                  // Смещаем каждый шар на четверть вектора смещения
                  vPos.x += moveX / 6; // Уменьшаем величину смещения
                  vPos.y += moveY / 6; // Уменьшаем величину смещения
                  otherPos.x -= moveX / 6; // Уменьшаем величину смещения
                  otherPos.y -= moveY / 6; // Уменьшаем величину смещения

                  // Вычисляем угол столкновения
                  const angle = Math.atan2(dy, dx);

                  const newSpeed =
                    Math.sqrt(
                      (vPos.speedX + otherPos.speedX) *
                        (vPos.speedX + otherPos.speedX) +
                        (vPos.speedY + otherPos.speedY) *
                          (vPos.speedY + otherPos.speedY)
                    ) * 0.5; // Половина суммы скоростей

                  // Устанавливаем новые значения скоростей для каждого шара
                  vPos.speedX = Math.cos(angle) * newSpeed;
                  vPos.speedY = Math.sin(angle) * newSpeed;
                  otherPos.speedX = Math.cos(angle + Math.PI) * newSpeed;
                  otherPos.speedY = Math.sin(angle + Math.PI) * newSpeed;
                }
              }
            }
          });
          newX = vPos.x + vPos.speedX;
          newY = vPos.y + vPos.speedY;
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
  }, [canvasRef]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      moveBall();
    }, 1); // Вызываем moveBall каждую секунду

    return () => {
      clearInterval(intervalId); // Очищаем интервал при размонтировании компонента
    };
  }, []); // Пустой массив зависимостей, чтобы эффект запускался только один раз при монтировании

  useEffect(() => {
    // Вызываем функцию moveBall для обновления позиции шара
    moveBall();
  }, [moveBall]);

  // Обновляем размеры канваса при изменении canvasSize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
  }, [canvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    // Очистка канваса
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBorder(context, "#3e1e00", 60, canvasSize.width, canvasSize.height); // рамка
    holes(context, canvasSize); // лунки

    ballPosition.map((val) => {
      if (val.show) {
        ball(context, val.x + 50, val.y + 50, val.color); // шар
      }
    });
  }, [ballPosition]);

  return (
    <div className={cls.canvasWin}>
      <canvas
        className={cls.canvas}
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
      />
    </div>
  );
};

export default Canvas;
