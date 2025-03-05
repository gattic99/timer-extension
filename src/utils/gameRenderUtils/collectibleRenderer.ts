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

// Draw collectibles (face in yellow circle)
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
    }
  });
};
