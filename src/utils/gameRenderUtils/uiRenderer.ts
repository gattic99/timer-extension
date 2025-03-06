
import { GameState } from "@/types/gameTypes";
import { formatTime } from "@/utils/timerUtils";

// Draw UI elements (score, timer, instructions)
export const drawUI = (
  ctx: CanvasRenderingContext2D, 
  gameState: GameState, 
  timeRemaining: number,
  mode: string = 'focus'
) => {
  // Draw score in a more visible box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, 10, 120, 30);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Arial';
  ctx.fillText(`Score: ${gameState.score}`, 20, 30);
  
  // Draw timer in a purple box with icon
  ctx.fillStyle = '#9b87f5'; // Purple color matching the floating timer
  ctx.fillRect(10, 50, 120, 30);
  
  // Draw icon based on mode
  if (mode === 'break') {
    // Draw coffee mug icon (simplified)
    ctx.fillStyle = '#FFFFFF';
    // Mug base
    ctx.fillRect(20, 57, 10, 15);
    // Mug handle
    ctx.beginPath();
    ctx.arc(32, 64, 5, Math.PI * 0.5, Math.PI * 1.5, false);
    ctx.fill();
  } else {
    // Draw clock icon (simplified)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(25, 64, 8, 0, Math.PI * 2);
    ctx.stroke();
    // Clock hands
    ctx.moveTo(25, 64);
    ctx.lineTo(25, 58);
    ctx.moveTo(25, 64);
    ctx.lineTo(29, 64);
    ctx.stroke();
  }
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px Arial';
  ctx.fillText(formatTime(timeRemaining), 40, 70);
  
  if (!gameState.gameOver) {
    // Draw instructions (only when game is active)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(400, 10, 290, 30);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    ctx.fillText('Arrow Keys/WASD to move, Up/Space to jump', 410, 30);
  }
};

// Draw game over overlay
export const drawGameOver = (ctx: CanvasRenderingContext2D, score: number) => {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, 700, 400);
  
  // Game over text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', 350, 180);
  
  // Final score
  ctx.font = 'bold 24px Arial';
  ctx.fillText(`Final Score: ${score}`, 350, 220);
  
  // Restart instructions
  ctx.font = '18px Arial';
  ctx.fillText('Press R to restart', 350, 260);
  
  // Reset text alignment for other text
  ctx.textAlign = 'start';
};
