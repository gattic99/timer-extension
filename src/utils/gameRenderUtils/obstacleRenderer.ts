
import { Obstacle } from "@/types/gameTypes";

// Draw obstacles (chairs, trash bins, printers, etc.)
export const drawObstacles = (ctx: CanvasRenderingContext2D, obstacles: Obstacle[], cameraOffsetX: number) => {
  obstacles.forEach(obstacle => {
    const adjustedX = obstacle.x - cameraOffsetX;
    
    // Only render obstacles that are visible on screen or near it
    if (adjustedX < 700 && adjustedX + obstacle.width > -50) {
      // Use the x position to create variants for each obstacle type
      const variant = Math.floor(obstacle.x % 3);
      
      if (obstacle.type === 'chair') {
        // Office chair variants
        if (variant === 0) {
          // Black standard chair
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
        } else if (variant === 1) {
          // Blue office chair
          ctx.fillStyle = '#1976D2';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height - 10);
          
          // Chair armrests
          ctx.fillStyle = '#1565C0';
          ctx.fillRect(adjustedX, obstacle.y + 15, 5, obstacle.height - 25);
          ctx.fillRect(adjustedX + obstacle.width - 5, obstacle.y + 15, 5, obstacle.height - 25);
          
          // Chair base
          ctx.fillStyle = '#424242';
          ctx.fillRect(adjustedX + 12, obstacle.y + obstacle.height - 10, obstacle.width - 24, 10);
          
          // Chair wheels
          ctx.fillStyle = '#1A1A1A';
          ctx.beginPath();
          ctx.arc(adjustedX + 12, obstacle.y + obstacle.height, 4, 0, Math.PI * 2);
          ctx.arc(adjustedX + obstacle.width - 12, obstacle.y + obstacle.height, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Executive leather chair
          ctx.fillStyle = '#795548';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height - 8);
          
          // Chair backrest
          ctx.fillStyle = '#5D4037';
          ctx.fillRect(adjustedX + 5, obstacle.y, obstacle.width - 10, obstacle.height - 20);
          
          // Chair base
          ctx.fillStyle = '#3E2723';
          ctx.fillRect(adjustedX + 8, obstacle.y + obstacle.height - 8, obstacle.width - 16, 8);
          
          // Golden accents
          ctx.fillStyle = '#FFC107';
          ctx.fillRect(adjustedX + 5, obstacle.y + 10, obstacle.width - 10, 2);
        }
      } else if (obstacle.type === 'trash') {
        // Trash bin variants
        if (variant === 0) {
          // Green recycling bin
          ctx.fillStyle = '#4CAF50';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
          
          // Trash lid
          ctx.fillStyle = '#388E3C';
          ctx.fillRect(adjustedX - 2, obstacle.y, obstacle.width + 4, 5);
          
          // Recycling symbol
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(adjustedX + 10, obstacle.y + 15, 10, 2);
          ctx.fillRect(adjustedX + 14, obstacle.y + 10, 2, 12);
        } else if (variant === 1) {
          // Blue paper bin
          ctx.fillStyle = '#2196F3';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
          
          // Bin lid
          ctx.fillStyle = '#1976D2';
          ctx.fillRect(adjustedX - 2, obstacle.y, obstacle.width + 4, 5);
          
          // Paper icon
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(adjustedX + 8, obstacle.y + 15, 15, 12);
          ctx.fillStyle = '#1976D2';
          ctx.fillRect(adjustedX + 10, obstacle.y + 18, 11, 1);
          ctx.fillRect(adjustedX + 10, obstacle.y + 21, 11, 1);
          ctx.fillRect(adjustedX + 10, obstacle.y + 24, 8, 1);
        } else {
          // Red trash can
          ctx.fillStyle = '#F44336';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
          
          // Trash swing lid
          ctx.fillStyle = '#D32F2F';
          ctx.beginPath();
          ctx.moveTo(adjustedX, obstacle.y + 5);
          ctx.lineTo(adjustedX + obstacle.width, obstacle.y + 5);
          ctx.lineTo(adjustedX + obstacle.width / 2, obstacle.y + 12);
          ctx.fill();
        }
      } else if (obstacle.type === 'printer') {
        // Printer variants
        if (variant === 0) {
          // Black printer
          ctx.fillStyle = '#424242';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
          
          // Printer details
          ctx.fillStyle = '#212121';
          ctx.fillRect(adjustedX + 5, obstacle.y + 5, obstacle.width - 10, 10);
          
          // Paper tray
          ctx.fillStyle = '#BDBDBD';
          ctx.fillRect(adjustedX, obstacle.y + obstacle.height - 5, obstacle.width, 5);
        } else if (variant === 1) {
          // Modern white printer
          ctx.fillStyle = '#ECEFF1';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
          
          // Screen
          ctx.fillStyle = '#90A4AE';
          ctx.fillRect(adjustedX + 10, obstacle.y + 3, 15, 8);
          
          // Buttons
          ctx.fillStyle = '#607D8B';
          ctx.fillRect(adjustedX + 30, obstacle.y + 5, 5, 5);
          ctx.fillRect(adjustedX + 38, obstacle.y + 5, 5, 5);
        } else {
          // Large office copier
          ctx.fillStyle = '#78909C';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
          
          // Document feeder
          ctx.fillStyle = '#546E7A';
          ctx.fillRect(adjustedX + 5, obstacle.y - 5, obstacle.width - 15, 5);
          
          // Control panel
          ctx.fillStyle = '#455A64';
          ctx.fillRect(adjustedX + obstacle.width - 15, obstacle.y + 3, 10, 10);
        }
      } else if (obstacle.type === 'computer') {
        // Computer variants
        if (variant === 0) {
          // Black monitor
          ctx.fillStyle = '#212121';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height - 5);
          
          // Screen
          ctx.fillStyle = '#2196F3';
          ctx.fillRect(adjustedX + 2, obstacle.y + 2, obstacle.width - 4, obstacle.height - 9);
          
          // Computer base
          ctx.fillStyle = '#616161';
          ctx.fillRect(adjustedX + 10, obstacle.y + obstacle.height - 5, obstacle.width - 20, 5);
        } else if (variant === 1) {
          // Silver macOS-style
          ctx.fillStyle = '#E0E0E0';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height - 5);
          
          // Screen
          ctx.fillStyle = '#BBDEFB';
          ctx.fillRect(adjustedX + 2, obstacle.y + 2, obstacle.width - 4, obstacle.height - 9);
          
          // Logo
          ctx.fillStyle = '#9E9E9E';
          ctx.beginPath();
          ctx.arc(adjustedX + obstacle.width / 2, obstacle.y + obstacle.height - 10, 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Stand
          ctx.fillStyle = '#9E9E9E';
          ctx.fillRect(adjustedX + 15, obstacle.y + obstacle.height - 5, 5, 5);
        } else {
          // Dual monitor setup
          // First monitor
          ctx.fillStyle = '#424242';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width - 10, obstacle.height - 5);
          
          // First screen
          ctx.fillStyle = '#4CAF50';
          ctx.fillRect(adjustedX + 2, obstacle.y + 2, obstacle.width - 14, obstacle.height - 9);
          
          // Second monitor
          ctx.fillStyle = '#424242';
          ctx.fillRect(adjustedX + 12, obstacle.y + 5, obstacle.width - 15, obstacle.height - 10);
          
          // Second screen
          ctx.fillStyle = '#7E57C2';
          ctx.fillRect(adjustedX + 14, obstacle.y + 7, obstacle.width - 19, obstacle.height - 14);
        }
      } else if (obstacle.type === 'paperclip') {
        // Office supply variants
        if (variant === 0) {
          // Silver paperclip
          ctx.fillStyle = '#9E9E9E';
          ctx.beginPath();
          ctx.arc(adjustedX + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(adjustedX + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (variant === 1) {
          // Sticky note pad
          ctx.fillStyle = '#FFF59D';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
          
          // Note lines
          ctx.strokeStyle = '#FBC02D';
          ctx.lineWidth = 0.5;
          for (let i = 3; i < obstacle.height; i += 3) {
            ctx.beginPath();
            ctx.moveTo(adjustedX + 2, obstacle.y + i);
            ctx.lineTo(adjustedX + obstacle.width - 2, obstacle.y + i);
            ctx.stroke();
          }
        } else {
          // Rubber eraser
          ctx.fillStyle = '#F48FB1';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
          
          // Eraser details
          ctx.fillStyle = '#EC407A';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width / 3, obstacle.height);
        }
      }
    }
  });
};
