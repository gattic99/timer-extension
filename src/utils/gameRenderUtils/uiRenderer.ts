
import { GameState } from "@/types/gameTypes";
import { formatTime } from "@/utils/timerUtils";

// Draw UI elements (score, timer, instructions)
export const drawUI = (
  ctx: CanvasRenderingContext2D, 
  gameState: GameState, 
  timeRemaining: number
) => {
  // Draw score in a more visible box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, 10, 120, 30);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Arial';
  ctx.fillText(`Score: ${gameState.score}`, 20, 30);
  
  // Draw timer in a box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, 50, 120, 30);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px Arial';
  ctx.fillText(formatTime(timeRemaining), 20, 70);
  
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
