
import { Obstacle } from "@/types/gameTypes";

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
      } else if (obstacle.type === 'stapler') {
        // Stapler
        ctx.fillStyle = '#D32F2F';
        ctx.fillRect(adjustedX, obstacle.y + 5, obstacle.width, obstacle.height - 5);
        
        // Stapler top
        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(adjustedX, obstacle.y, obstacle.width * 0.7, 5);
        
        // Stapler details
        ctx.fillStyle = '#000000';
        ctx.fillRect(adjustedX + obstacle.width - 5, obstacle.y + 7, 3, 3);
      } else if (obstacle.type === 'coffee') {
        // Coffee mug
        ctx.fillStyle = '#795548';
        ctx.fillRect(adjustedX, obstacle.y + 5, obstacle.width, obstacle.height - 5);
        
        // Handle
        ctx.beginPath();
        ctx.arc(adjustedX + obstacle.width, obstacle.y + obstacle.height/2, 5, Math.PI * 1.5, Math.PI * 0.5, false);
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Coffee
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(adjustedX + 2, obstacle.y + 7, obstacle.width - 4, 4);
      } else if (obstacle.type === 'plant') {
        // Office plant pot
        ctx.fillStyle = '#795548';
        ctx.fillRect(adjustedX, obstacle.y + obstacle.height/2, obstacle.width, obstacle.height/2);
        
        // Plant leaves
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(adjustedX + obstacle.width/2, obstacle.y + obstacle.height/3, obstacle.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.arc(adjustedX + obstacle.width/2 - 5, obstacle.y + obstacle.height/4, obstacle.width/3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.arc(adjustedX + obstacle.width/2 + 5, obstacle.y + obstacle.height/5, obstacle.width/4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
};
