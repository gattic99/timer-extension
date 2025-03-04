
import { Platform } from "@/types/gameTypes";

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
