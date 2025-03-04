
import { GameState } from "@/types/gameTypes";

// Create and load the wallpaper image outside the function
const wallpaperImage = new Image();
wallpaperImage.onload = () => {
  console.log("Wallpaper image loaded successfully");
};
wallpaperImage.onerror = (err) => {
  console.error("Error loading wallpaper image:", err);
};
wallpaperImage.src = '/lovable-uploads/294c69bd-ddb4-4e23-8ba0-eac7920c4ecd.png';

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
  
  // Draw wallpaper with parallax effect
  // The wallpaper will be placed on the upper part of the wall
  if (wallpaperImage.complete && wallpaperImage.naturalWidth > 0) {
    // Create a pattern with the wallpaper
    const patternSize = 150; // Size of each wallpaper instance
    const wallpaperY = 30; // Position from top
    
    // Create a small parallax effect for the wallpaper
    const slowParallax = cameraOffsetX * 0.3;
    
    // Draw multiple instances of the wallpaper with spacing
    for (let i = -patternSize; i < 700 + patternSize; i += patternSize) {
      ctx.drawImage(
        wallpaperImage,
        i - (slowParallax % patternSize), // X position with slow parallax
        wallpaperY,
        patternSize,
        patternSize
      );
    }
  }
  
  // Add some decorative elements
  // Draw colored bands on the walls
  ctx.fillStyle = '#FFD54F'; // Amber accent color
  ctx.fillRect(0, 150, 700, 10);
  
  // Floor grid pattern with parallax effect
  ctx.strokeStyle = '#DEDEDE';
  ctx.lineWidth = 1;
  for (let i = 0; i < 700; i += 50) {
    // Draw vertical lines with parallax effect
    const offset = cameraOffsetX % 50;
    ctx.beginPath();
    ctx.moveTo(i - offset, 200); // Start grid from halfway down
    ctx.lineTo(i - offset, 400);
    ctx.stroke();
    
    // Draw horizontal lines for the floor
    for (let j = 200; j <= 400; j += 50) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(700, j);
      ctx.stroke();
    }
  }
  
  // Add some office plants or furniture as silhouettes
  // Office plant
  const plantPositions = [100, 300, 500];
  plantPositions.forEach(position => {
    const adjustedX = position - (cameraOffsetX % 700);
    if (adjustedX > -50 && adjustedX < 750) {
      // Plant pot
      ctx.fillStyle = '#795548';
      ctx.fillRect(adjustedX - 15, 185, 30, 15);
      
      // Plant
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.moveTo(adjustedX, 140);
      ctx.lineTo(adjustedX - 25, 185);
      ctx.lineTo(adjustedX + 25, 185);
      ctx.fill();
    }
  });
};
