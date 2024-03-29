// canvasUtils.ts

//// ============================================================================
// рамка
export function drawBorder(
  context: CanvasRenderingContext2D,
  color: string,
  lineWidth: number,
  width: number,
  height: number
) {
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.strokeRect(0, 0, width, height);
}
//// ============================================================================
// лунки
export type CanvasSize = {
  width: number;
  height: number;
};

export function holes(
  context: CanvasRenderingContext2D,
  canvasSize: CanvasSize
) {
  const indent = 35;
  const circleData = [
    { x: indent, y: indent },
    { x: indent, y: canvasSize.height / 2 },
    { x: indent, y: canvasSize.height - indent },
    { x: canvasSize.width - indent, y: indent },
    { x: canvasSize.width - indent, y: canvasSize.height / 2 },
    { x: canvasSize.width - indent, y: canvasSize.height - indent },
  ];

  const radius = 20;
  const startAngle = 0;
  const endAngle = Math.PI * 2;
  context.fillStyle = "#000000";

  circleData.forEach(({ x, y }) => {
    context.beginPath();
    context.arc(x, y, radius, startAngle, endAngle);
    context.fill();
  });
}

//// ============================================================================
// шар
export function ball(
  context: CanvasRenderingContext2D,
  X: number,
  Y: number,
  color: string
) {
  // тень от шара
  context.shadowColor = "black";
  context.shadowBlur = 10;
  context.shadowOffsetX = 5;
  context.shadowOffsetY = 5;

  // круг с тенью (цветной)
  context.beginPath();
  context.fillStyle = color;
  context.arc(X, Y, 20, 0, Math.PI * 2);
  context.fill();

  context.shadowColor = "transparent";

  // полупрозрачная белая тень Б
  context.beginPath();
  context.fillStyle = "rgba(255, 255, 255, 0.1)";
  context.arc(X - 6, Y - 6, 6, 0, Math.PI * 2);
  context.fill();

  // полупрозрачная белая тень М
  context.shadowColor = "#ffffff";
  context.shadowBlur = 8;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;

  // отблеск
  context.beginPath();
  context.fillStyle = "#ffffff";
  context.arc(X - 6, Y - 6, 2.4, 0, Math.PI * 2);
  context.fill();
  context.shadowColor = "transparent";
}
