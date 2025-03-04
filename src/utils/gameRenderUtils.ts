
import { GameCharacter, Platform, Obstacle, Coin, GameState } from "@/types/gameTypes";
import { formatTime } from "@/utils/timerUtils";

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

// Draw platforms (desks, floors, shelves)
export const drawPlatforms = (ctx: CanvasRenderingContext2D, platforms: Platform[], cameraOffsetX: number) => {
  platforms.forEach(platform => {
    const adjustedX = platform.x - cameraOffsetX;
    
    // Only render platforms that are visible on screen or near it
    if (adjustedX < 700 && adjustedX + platform.width > -100) {
      if (platform.type === 'floor') {
        // Floor - dark gray carpet
        ctx.fillStyle = '#9E9E9E';
        ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
        
        // Add carpet texture
        ctx.fillStyle = '#8A8A8A';
        for (let i = 0; i < platform.width; i += 10) {
          for (let j = 0; j < platform.height; j += 5) {
            if ((i + j) % 2 === 0) {
              ctx.fillRect(adjustedX + i, platform.y + j, 5, 3);
            }
          }
        }
      } else if (platform.type === 'desk') {
        // Desk - wooden brown
        ctx.fillStyle = '#A67C52';
        ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
        
        // Add wood grain texture
        ctx.strokeStyle = '#8B5A2B';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < platform.width; i += 15) {
          ctx.beginPath();
          ctx.moveTo(adjustedX + i, platform.y);
          ctx.lineTo(adjustedX + i, platform.y + platform.height);
          ctx.stroke();
        }
      } else if (platform.type === 'shelf') {
        // Shelf - light wooden color
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
        
        // Add shelf brackets
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(adjustedX + 5, platform.y, 5, 15);
        ctx.fillRect(adjustedX + platform.width - 10, platform.y, 5, 15);
      }
    }
  });
};

// Draw obstacles (chairs, trash bins, printers, etc.)
export const drawObstacles = (ctx: CanvasRenderingContext2D, obstacles: Obstacle[], cameraOffsetX: number) => {
  obstacles.forEach(obstacle => {
    const adjustedX = obstacle.x - cameraOffsetX;
    
    // Only render obstacles that are visible on screen or near it
    if (adjustedX < 700 && adjustedX + obstacle.width > -50) {
      if (obstacle.type === 'chair') {
        // Office chair
        ctx.fillStyle = '#2E2E2E';
        ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height - 10);
        
        // Chair base
        ctx.fillStyle = '#424242';
        ctx.fillRect(adjustedX + 10, obstacle.y + obstacle.height - 10, obstacle.width - 20, 10);
        
        // Chair wheels
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.arc(adjustedX + 10, obstacle.y + obstacle.height, 5, 0, Math.PI * 2);
        ctx.arc(adjustedX + obstacle.width - 10, obstacle.y + obstacle.height, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (obstacle.type === 'trash') {
        // Trash bin
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
        
        // Trash lid
        ctx.fillStyle = '#388E3C';
        ctx.fillRect(adjustedX - 2, obstacle.y, obstacle.width + 4, 5);
        
        // Trash contents
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(adjustedX + 5, obstacle.y + 10, 5, 8);
        ctx.fillRect(adjustedX + 15, obstacle.y + 8, 8, 5);
      } else if (obstacle.type === 'printer') {
        // Printer
        ctx.fillStyle = '#424242';
        ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
        
        // Printer details
        ctx.fillStyle = '#212121';
        ctx.fillRect(adjustedX + 5, obstacle.y + 5, obstacle.width - 10, 10);
        
        // Paper tray
        ctx.fillStyle = '#BDBDBD';
        ctx.fillRect(adjustedX, obstacle.y + obstacle.height - 5, obstacle.width, 5);
      } else if (obstacle.type === 'computer') {
        // Computer monitor
        ctx.fillStyle = '#212121';
        ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height - 5);
        
        // Screen
        ctx.fillStyle = '#2196F3';
        ctx.fillRect(adjustedX + 2, obstacle.y + 2, obstacle.width - 4, obstacle.height - 9);
        
        // Computer base
        ctx.fillStyle = '#616161';
        ctx.fillRect(adjustedX + 10, obstacle.y + obstacle.height - 5, obstacle.width - 20, 5);
      } else if (obstacle.type === 'paperclip') {
        // Paperclip
        ctx.fillStyle = '#9E9E9E';
        ctx.beginPath();
        ctx.arc(adjustedX + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(adjustedX + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
};

// Draw collectibles (face in yellow circle)
export const drawCollectibles = (ctx: CanvasRenderingContext2D, coins: Coin[], cameraOffsetX: number) => {
  coins.forEach(coin => {
    if (!coin.collected) {
      const adjustedX = coin.x - cameraOffsetX;
      
      // Only render coins that are visible on screen or near it
      if (adjustedX < 700 && adjustedX + coin.width > -20) {
        const centerX = adjustedX + coin.width / 2;
        const centerY = coin.y + coin.height / 2;
        
        // Draw yellow circle background
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(centerX, centerY, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw the collectible using the face image
        try {
          const image = new Image();
          image.src = '/lovable-uploads/e2488b89-7645-4aed-bbd8-e09701affc1e.png';
          
          // Create circular clipping path
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, coin.width / 2 - 1, 0, Math.PI * 2);
          ctx.clip();
          
          // Draw the image within the clipping path
          ctx.drawImage(
            image, 
            adjustedX, 
            coin.y, 
            coin.width, 
            coin.height
          );
          
          // Restore the context
          ctx.restore();
          
          // Add a subtle border
          ctx.strokeStyle = '#B8860B';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, coin.width / 2, 0, Math.PI * 2);
          ctx.stroke();
        } catch (error) {
          console.error("Error loading collectible image:", error);
          // Fallback if image fails to load
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(centerX, centerY, coin.width / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  });
};

// Draw character
export const drawCharacter = (ctx: CanvasRenderingContext2D, character: GameCharacter) => {
  // Body (shirt)
  ctx.fillStyle = '#3F51B5'; // Blue shirt
  ctx.fillRect(character.x, character.y, character.width, character.height - 15);
  
  // Pants
  ctx.fillStyle = '#212121'; // Dark pants
  ctx.fillRect(character.x, character.y + character.height - 15, character.width, 15);
  
  // Head
  ctx.fillStyle = '#FFE0B2'; // Skin tone
  ctx.beginPath();
  ctx.arc(character.x + character.width / 2, character.y - 5, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // Hair
  ctx.fillStyle = '#5D4037'; // Brown hair
  ctx.beginPath();
  ctx.arc(character.x + character.width / 2, character.y - 10, 8, 0, Math.PI, true);
  ctx.fill();
};

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
