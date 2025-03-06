
import { Platform } from "@/types/gameTypes";

// Draw platforms (desks, floors, shelves)
export const drawPlatforms = (ctx: CanvasRenderingContext2D, platforms: Platform[], cameraOffsetX: number) => {
  platforms.forEach(platform => {
    const adjustedX = platform.x - cameraOffsetX;
    
    // Only render platforms that are visible on screen or near it
    if (adjustedX < 700 && adjustedX + platform.width > -100) {
      if (platform.type === 'floor') {
        // Floor - with different carpet variants
        const platformVariant = (platform.x % 3); // Create 3 different floor variants
        
        if (platformVariant === 0) {
          // Standard gray carpet
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
        } else if (platformVariant === 1) {
          // Blue carpet
          ctx.fillStyle = '#546E7A';
          ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
          
          // Add carpet pattern
          ctx.fillStyle = '#455A64';
          for (let i = 0; i < platform.width; i += 15) {
            for (let j = 0; j < platform.height; j += 8) {
              ctx.fillRect(adjustedX + i, platform.y + j, 8, 4);
            }
          }
        } else {
          // Corporate beige carpet
          ctx.fillStyle = '#BCAAA4';
          ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
          
          // Add carpet dots
          ctx.fillStyle = '#A1887F';
          for (let i = 5; i < platform.width; i += 18) {
            for (let j = 3; j < platform.height; j += 10) {
              ctx.beginPath();
              ctx.arc(adjustedX + i, platform.y + j, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      } else if (platform.type === 'desk') {
        // Desk variants based on position
        const deskVariant = (platform.x % 4); // Create 4 different desk variants
        
        if (deskVariant === 0) {
          // Classic wooden brown
          ctx.fillStyle = '#A67C52';
          ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
          
          // Wood grain texture
          ctx.strokeStyle = '#8B5A2B';
          ctx.lineWidth = 0.5;
          for (let i = 0; i < platform.width; i += 15) {
            ctx.beginPath();
            ctx.moveTo(adjustedX + i, platform.y);
            ctx.lineTo(adjustedX + i, platform.y + platform.height);
            ctx.stroke();
          }
        } else if (deskVariant === 1) {
          // Modern white desk
          ctx.fillStyle = '#ECEFF1';
          ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
          
          // Add subtle texture
          ctx.strokeStyle = '#CFD8DC';
          ctx.lineWidth = 0.5;
          for (let i = 0; i < platform.width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(adjustedX + i, platform.y);
            ctx.lineTo(adjustedX + i, platform.y + platform.height);
            ctx.stroke();
          }
        } else if (deskVariant === 2) {
          // Dark cherry wood
          ctx.fillStyle = '#5D4037';
          ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
          
          // Wood texture
          ctx.strokeStyle = '#4E342E';
          ctx.lineWidth = 0.7;
          for (let i = 5; i < platform.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(adjustedX + i, platform.y);
            ctx.lineTo(adjustedX + i, platform.y + platform.height);
            ctx.stroke();
          }
        } else {
          // Gray metal desk
          ctx.fillStyle = '#78909C';
          ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
          
          // Metal detail
          ctx.fillStyle = '#607D8B';
          ctx.fillRect(adjustedX, platform.y, platform.width, 3);
          ctx.fillRect(adjustedX, platform.y + platform.height - 3, platform.width, 3);
        }
      } else if (platform.type === 'shelf') {
        // Shelf variants
        const shelfVariant = (platform.x % 3); // Create 3 different shelf variants
        
        if (shelfVariant === 0) {
          // Light wooden shelf
          ctx.fillStyle = '#D2B48C';
          ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
          
          // Add shelf brackets
          ctx.fillStyle = '#A9A9A9';
          ctx.fillRect(adjustedX + 5, platform.y, 5, 15);
          ctx.fillRect(adjustedX + platform.width - 10, platform.y, 5, 15);
        } else if (shelfVariant === 1) {
          // Metal shelf
          ctx.fillStyle = '#90A4AE';
          ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
          
          // Metal brackets
          ctx.fillStyle = '#62727B';
          ctx.fillRect(adjustedX + 5, platform.y, 3, 12);
          ctx.fillRect(adjustedX + platform.width - 8, platform.y, 3, 12);
        } else {
          // Fancy glass shelf
          ctx.fillStyle = '#B3E5FC';
          ctx.globalAlpha = 0.7;
          ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
          ctx.globalAlpha = 1.0;
          
          // Chrome brackets
          ctx.fillStyle = '#E0E0E0';
          ctx.fillRect(adjustedX + 8, platform.y, 2, 10);
          ctx.fillRect(adjustedX + platform.width - 10, platform.y, 2, 10);
        }
      }
    }
  });
};
