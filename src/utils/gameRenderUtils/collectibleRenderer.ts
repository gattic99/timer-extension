
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
        const centerX = adjustedX + coin.width / 2;
        const centerY = coin.y + coin.height / 2;
        
        // Create visual variants based on position
        const variant = Math.floor(coin.x % 4);
        
        if (variant === 0) {
          // Yellow coin with face (original style)
          // Draw yellow circle background
          ctx.fillStyle = "#FFF01B";
          ctx.beginPath();
          ctx.arc(centerX, centerY, coin.width / 2, 0, Math.PI * 2);
          ctx.fill();

          // Create circular clipping path
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, coin.width / 2 - 1, 0, Math.PI * 2);
          ctx.clip();

          // Draw the image within the clipping path
          ctx.drawImage(faceImage, adjustedX, coin.y, coin.width, coin.height);

          // Restore the context
          ctx.restore();

          // Add a subtle border
          ctx.strokeStyle = "#FFF01B";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, coin.width / 2, 0, Math.PI * 2);
          ctx.stroke();
        } 
        else if (variant === 1) {
          // Coffee mug collectible
          // Mug body
          ctx.fillStyle = "#D32F2F";
          ctx.beginPath();
          ctx.arc(centerX, centerY, coin.width / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Mug details
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(centerX, centerY, coin.width / 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Steam
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX - 5, centerY - coin.height / 3);
          ctx.quadraticCurveTo(centerX, centerY - coin.height / 2 - 3, centerX + 5, centerY - coin.height / 3);
          ctx.stroke();
        }
        else if (variant === 2) {
          // Document folder
          // Folder background
          ctx.fillStyle = "#4FC3F7";
          ctx.beginPath();
          ctx.moveTo(adjustedX, coin.y + 3);
          ctx.lineTo(adjustedX + coin.width, coin.y + 3);
          ctx.lineTo(adjustedX + coin.width, coin.y + coin.height);
          ctx.lineTo(adjustedX, coin.y + coin.height);
          ctx.closePath();
          ctx.fill();
          
          // Folder tab
          ctx.fillStyle = "#29B6F6";
          ctx.beginPath();
          ctx.moveTo(adjustedX + coin.width / 3, coin.y);
          ctx.lineTo(adjustedX + coin.width * 2/3, coin.y);
          ctx.lineTo(adjustedX + coin.width * 2/3, coin.y + 5);
          ctx.lineTo(adjustedX + coin.width / 3, coin.y + 5);
          ctx.closePath();
          ctx.fill();
          
          // Document lines
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(adjustedX + 5, coin.y + 10 + i * 4);
            ctx.lineTo(adjustedX + coin.width - 5, coin.y + 10 + i * 4);
            ctx.stroke();
          }
        }
        else {
          // Purple bonus coin
          // Draw sparkling circle
          ctx.fillStyle = "#9C27B0";
          ctx.beginPath();
          ctx.arc(centerX, centerY, coin.width / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Star effect
          ctx.fillStyle = "#E1BEE7";
          // Top point
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - coin.height / 3);
          ctx.lineTo(centerX + 3, centerY - 2);
          ctx.lineTo(centerX - 3, centerY - 2);
          ctx.closePath();
          ctx.fill();
          
          // Right point
          ctx.beginPath();
          ctx.moveTo(centerX + coin.width / 3, centerY);
          ctx.lineTo(centerX + 2, centerY + 3);
          ctx.lineTo(centerX + 2, centerY - 3);
          ctx.closePath();
          ctx.fill();
          
          // Bottom point
          ctx.beginPath();
          ctx.moveTo(centerX, centerY + coin.height / 3);
          ctx.lineTo(centerX + 3, centerY + 2);
          ctx.lineTo(centerX - 3, centerY + 2);
          ctx.closePath();
          ctx.fill();
          
          // Left point
          ctx.beginPath();
          ctx.moveTo(centerX - coin.width / 3, centerY);
          ctx.lineTo(centerX - 2, centerY + 3);
          ctx.lineTo(centerX - 2, centerY - 3);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  });
};
