
import { Coin } from "@/types/gameTypes";

// Create the face image outside the function to ensure it's only created once
const faceImage = new Image();
// Add an onload handler to ensure the image is fully loaded before use
faceImage.onload = () => {
  console.log("Coin image loaded successfully");
};
faceImage.onerror = (err) => {
  console.error("Error loading coin image:", err);
};
faceImage.src = "/coin-sina.png";

// Draw collectibles with variety
export const drawCollectibles = (
  ctx: CanvasRenderingContext2D,
  coins: Coin[],
  cameraOffsetX: number
) => {
  // Draw each coin
  coins.forEach((coin) => {
    if (!coin.collected) {
      const adjustedX = coin.x - cameraOffsetX;

      // Only render coins that are visible on screen or near it
      if (adjustedX < 700 && adjustedX + coin.width > -20) {
        // Increase the rendering size by 50%
        const scaleFactor = 1.5;
        const centerX = adjustedX + coin.width / 2;
        const centerY = coin.y + coin.height / 2;
        const renderWidth = coin.width * scaleFactor;
        const renderHeight = coin.height * scaleFactor;
        
        // Create visual variants based on position
        const variant = Math.floor(coin.x % 4);
        
        if (variant === 0) {
          // Yellow coin with face (original style)
          // Draw yellow circle background
          ctx.fillStyle = "#FFF01B";
          ctx.beginPath();
          ctx.arc(centerX, centerY, renderWidth / 2, 0, Math.PI * 2);
          ctx.fill();

          // Create circular clipping path
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, renderWidth / 2 - 1, 0, Math.PI * 2);
          ctx.clip();

          // Draw the image within the clipping path
          ctx.drawImage(
            faceImage, 
            centerX - renderWidth / 2, 
            centerY - renderHeight / 2, 
            renderWidth, 
            renderHeight
          );

          // Restore the context
          ctx.restore();

          // Add a subtle border
          ctx.strokeStyle = "#FFF01B";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, renderWidth / 2, 0, Math.PI * 2);
          ctx.stroke();
        } 
        else if (variant === 1) {
          // Coffee mug collectible
          // Mug body
          ctx.fillStyle = "#D32F2F";
          ctx.beginPath();
          ctx.arc(centerX, centerY, renderWidth / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Mug details
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(centerX, centerY, renderWidth / 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Steam
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX - 7, centerY - renderHeight / 3);
          ctx.quadraticCurveTo(centerX, centerY - renderHeight / 2 - 5, centerX + 7, centerY - renderHeight / 3);
          ctx.stroke();
        }
        else if (variant === 2) {
          // Document folder
          // Folder background
          ctx.fillStyle = "#4FC3F7";
          ctx.beginPath();
          ctx.moveTo(centerX - renderWidth / 2, centerY - renderHeight / 2 + 5);
          ctx.lineTo(centerX + renderWidth / 2, centerY - renderHeight / 2 + 5);
          ctx.lineTo(centerX + renderWidth / 2, centerY + renderHeight / 2);
          ctx.lineTo(centerX - renderWidth / 2, centerY + renderHeight / 2);
          ctx.closePath();
          ctx.fill();
          
          // Folder tab
          ctx.fillStyle = "#29B6F6";
          ctx.beginPath();
          ctx.moveTo(centerX - renderWidth / 6, centerY - renderHeight / 2);
          ctx.lineTo(centerX + renderWidth / 6, centerY - renderHeight / 2);
          ctx.lineTo(centerX + renderWidth / 6, centerY - renderHeight / 2 + 7);
          ctx.lineTo(centerX - renderWidth / 6, centerY - renderHeight / 2 + 7);
          ctx.closePath();
          ctx.fill();
          
          // Document lines
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX - renderWidth / 2 + 7, centerY - renderHeight / 4 + i * 6);
            ctx.lineTo(centerX + renderWidth / 2 - 7, centerY - renderHeight / 4 + i * 6);
            ctx.stroke();
          }
        }
        else {
          // Purple bonus coin
          // Draw sparkling circle
          ctx.fillStyle = "#9C27B0";
          ctx.beginPath();
          ctx.arc(centerX, centerY, renderWidth / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Star effect
          ctx.fillStyle = "#E1BEE7";
          // Top point
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - renderHeight / 3);
          ctx.lineTo(centerX + 5, centerY - 3);
          ctx.lineTo(centerX - 5, centerY - 3);
          ctx.closePath();
          ctx.fill();
          
          // Right point
          ctx.beginPath();
          ctx.moveTo(centerX + renderWidth / 3, centerY);
          ctx.lineTo(centerX + 3, centerY + 5);
          ctx.lineTo(centerX + 3, centerY - 5);
          ctx.closePath();
          ctx.fill();
          
          // Bottom point
          ctx.beginPath();
          ctx.moveTo(centerX, centerY + renderHeight / 3);
          ctx.lineTo(centerX + 5, centerY + 3);
          ctx.lineTo(centerX - 5, centerY + 3);
          ctx.closePath();
          ctx.fill();
          
          // Left point
          ctx.beginPath();
          ctx.moveTo(centerX - renderWidth / 3, centerY);
          ctx.lineTo(centerX - 3, centerY + 5);
          ctx.lineTo(centerX - 3, centerY - 5);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  });
};
