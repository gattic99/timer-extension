
import { Coin } from "@/types/gameTypes";

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
