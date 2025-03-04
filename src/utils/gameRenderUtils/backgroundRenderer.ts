
import { GameState } from "@/types/gameTypes";

// Draw the office background and floor grid
export const drawBackground = (ctx: CanvasRenderingContext2D, cameraOffsetX: number) => {
  // Clear canvas
  ctx.clearRect(0, 0, 700, 400);
  
  // Draw office background
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, '#F1F1F1'); // Light gray for ceiling
  gradient.addColorStop(1, '#E6E6E6'); // Slightly darker for floor
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 700, 400);
  
  // Draw floor grid pattern
  ctx.strokeStyle = '#DEDEDE';
  ctx.lineWidth = 1;
  for (let i = 0; i < 700; i += 50) {
    // Draw vertical lines with parallax effect
    const offset = cameraOffsetX % 50;
    ctx.beginPath();
    ctx.moveTo(i - offset, 0);
    ctx.lineTo(i - offset, 400);
    ctx.stroke();
    
    // Draw horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(700, i);
    ctx.stroke();
  }
};
