// canvasLogics.ts

// export let speedX = 1;
// export let speedY = 1;

// export const moveBall = (
//   ballPosition: { x: number; y: number },
//   canvas: HTMLCanvasElement | null
// ) => {
//   return () => {
//     setBallPosition((prevPosition) => {
//       let newX = prevPosition.x + speedX;
//       let newY = prevPosition.y + speedY;

//       if (canvas) {
//         if (newX >= canvas.width - 100 || newX <= 0) {
//           speedX *= -1;
//         }
//         if (newY >= canvas.height - 100 || newY <= 0) {
//           speedY *= -1;
//         }
//         newX = prevPosition.x + speedX;
//         newY = prevPosition.y + speedY;
//       }

//       return { x: newX, y: newY };
//     });
//   };
// };
