import cls from "./canvas.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { drawBorder, holes, ball } from "./ui/canvasUtils/canvasUtils";
// import { moveBall, speedX, speedY } from "./ui/canvasLogics/canvasLogics";

type CanvasSize = { width: number; height: number };

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: 500,
    height: 800,
  });

  const [ballPosition, setBallPosition] = useState([
    { color: "#3e1e00", x: 140, y: 105, show: true, speedX: 0, speedY: 0 },
    // { color: "#54d53b", x: 180, y: 105, show: true, speedX: 0, speedY: 0 },
    // { color: "#115f00", x: 220, y: 105, show: true, speedX: 0, speedY: 0 },
    // { color: "#a81616", x: 260, y: 105, show: true, speedX: 0, speedY: 0 },
    // { color: "#d47979", x: 240, y: 140, show: true, speedX: 0, speedY: 0 },
    // { color: "#fcd423", x: 160, y: 140, show: true, speedX: 0, speedY: 0 },
    // { color: "#000000", x: 200, y: 140, show: true, speedX: 0, speedY: 0 },
    // { color: "#0000c4", x: 220, y: 175, show: true, speedX: 0, speedY: 0 },
    // { color: "#c47500", x: 180, y: 175, show: true, speedX: 0, speedY: 0 },
    // { color: "#98009b", x: 200, y: 210, show: true, speedX: 0, speedY: 0 },
    { color: "#e5e5e5", x: 200, y: 600, show: true, speedX: 1, speedY: 1 },
  ]);

  // Функция для обновления координат шара
  const moveBall = useCallback(() => {
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
              const dx = vPos.x - otherPos.x;
              const dy = vPos.y - otherPos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < 40) {
                // Вычисляем вектор смещения для каждого шара
                const moveX = dx * 0.25; // Уменьшаем величину смещения
                const moveY = dy * 0.25; // Уменьшаем величину смещения

                // Смещаем каждый шар на четверть вектора смещения
                vPos.x += moveX / 4; // Уменьшаем величину смещения
                vPos.y += moveY / 4; // Уменьшаем величину смещения
                otherPos.x -= moveX / 4; // Уменьшаем величину смещения
                otherPos.y -= moveY / 4; // Уменьшаем величину смещения

                // Вычисляем угол столкновения
                const angle = Math.atan2(dy, dx);

                // Уменьшаем скорость каждого шара на 20%
                const speed =
                  Math.sqrt(
                    vPos.speedX * vPos.speedX + vPos.speedY * vPos.speedY
                  ) * 0.8; // Уменьшаем скорость на 20%
                vPos.speedX = Math.cos(angle) * speed;
                vPos.speedY = Math.sin(angle) * speed;

                // Уменьшаем скорость второго шара на 20%
                const otherSpeed =
                  Math.sqrt(
                    otherPos.speedX * otherPos.speedX +
                      otherPos.speedY * otherPos.speedY
                  ) * 0.8; // Уменьшаем скорость на 20%
                otherPos.speedX = Math.cos(angle + Math.PI) * otherSpeed;
                otherPos.speedY = Math.sin(angle + Math.PI) * otherSpeed;
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
