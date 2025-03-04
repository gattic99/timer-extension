import { Platform, Obstacle, Coin, GameCharacter } from "@/types/gameTypes";

// Office-themed platforms (desks, floors, shelves) with spacing
export const initialPlatforms: Platform[] = [
  // Main floor sections
  { x: 0, y: 350, width: 800, height: 20, type: 'floor' },
  { x: 850, y: 350, width: 400, height: 20, type: 'floor' },
  { x: 1300, y: 350, width: 600, height: 20, type: 'floor' },
  { x: 2000, y: 350, width: 500, height: 20, type: 'floor' },
  { x: 2600, y: 350, width: 400, height: 20, type: 'floor' },
  { x: 3050, y: 350, width: 500, height: 20, type: 'floor' },
  { x: 3600, y: 350, width: 600, height: 20, type: 'floor' },
  { x: 4250, y: 350, width: 500, height: 20, type: 'floor' },
  
  // Desks (platforms at various heights)
  { x: 250, y: 280, width: 200, height: 15, type: 'desk' },
  { x: 600, y: 250, width: 150, height: 15, type: 'desk' },
  { x: 900, y: 280, width: 180, height: 15, type: 'desk' },
  { x: 1150, y: 220, width: 120, height: 15, type: 'desk' },
  { x: 1400, y: 250, width: 200, height: 15, type: 'desk' },
  { x: 1700, y: 200, width: 150, height: 15, type: 'desk' },
  { x: 2050, y: 280, width: 180, height: 15, type: 'desk' },
  { x: 2300, y: 230, width: 200, height: 15, type: 'desk' },
  { x: 2750, y: 250, width: 180, height: 15, type: 'desk' },
  { x: 3200, y: 280, width: 200, height: 15, type: 'desk' },
  { x: 3500, y: 230, width: 150, height: 15, type: 'desk' },
  { x: 3800, y: 250, width: 180, height: 15, type: 'desk' },
  { x: 4100, y: 280, width: 200, height: 15, type: 'desk' },
  
  // Shelves (higher platforms)
  { x: 400, y: 180, width: 100, height: 10, type: 'shelf' },
  { x: 750, y: 150, width: 100, height: 10, type: 'shelf' },
  { x: 1050, y: 150, width: 80, height: 10, type: 'shelf' },
  { x: 1500, y: 170, width: 120, height: 10, type: 'shelf' },
  { x: 1900, y: 130, width: 100, height: 10, type: 'shelf' },
  { x: 2200, y: 150, width: 80, height: 10, type: 'shelf' },
  { x: 2450, y: 170, width: 100, height: 10, type: 'shelf' },
  { x: 2900, y: 150, width: 90, height: 10, type: 'shelf' },
  { x: 3300, y: 180, width: 100, height: 10, type: 'shelf' },
  { x: 3650, y: 140, width: 80, height: 10, type: 'shelf' },
  { x: 4000, y: 160, width: 110, height: 10, type: 'shelf' },
];

// Office obstacles (chairs, trash bins, printers, etc.)
export const initialObstacles: Obstacle[] = [
  // Chairs
  { x: 300, y: 240, width: 40, height: 40, type: 'chair' },
  { x: 670, y: 210, width: 40, height: 40, type: 'chair' },
  { x: 970, y: 240, width: 40, height: 40, type: 'chair' },
  { x: 1470, y: 210, width: 40, height: 40, type: 'chair' },
  { x: 2120, y: 240, width: 40, height: 40, type: 'chair' },
  { x: 2650, y: 240, width: 40, height: 40, type: 'chair' },
  { x: 3050, y: 240, width: 40, height: 40, type: 'chair' },
  { x: 3620, y: 210, width: 40, height: 40, type: 'chair' },
  { x: 4200, y: 240, width: 40, height: 40, type: 'chair' },
  
  // Trash bins
  { x: 500, y: 330, width: 30, height: 40, type: 'trash' },
  { x: 1100, y: 330, width: 30, height: 40, type: 'trash' },
  { x: 1600, y: 330, width: 30, height: 40, type: 'trash' },
  { x: 2200, y: 330, width: 30, height: 40, type: 'trash' },
  { x: 2800, y: 330, width: 30, height: 40, type: 'trash' },
  { x: 3300, y: 330, width: 30, height: 40, type: 'trash' },
  { x: 3900, y: 330, width: 30, height: 40, type: 'trash' },
  
  // Printers
  { x: 350, y: 265, width: 50, height: 25, type: 'printer' },
  { x: 1200, y: 205, width: 50, height: 25, type: 'printer' },
  { x: 1800, y: 185, width: 50, height: 25, type: 'printer' },
  { x: 2500, y: 265, width: 50, height: 25, type: 'printer' },
  { x: 3100, y: 205, width: 50, height: 25, type: 'printer' },
  { x: 3700, y: 185, width: 50, height: 25, type: 'printer' },
  
  // Computers
  { x: 280, y: 260, width: 35, height: 30, type: 'computer' },
  { x: 950, y: 260, width: 35, height: 30, type: 'computer' },
  { x: 1450, y: 230, width: 35, height: 30, type: 'computer' },
  { x: 2100, y: 260, width: 35, height: 30, type: 'computer' },
  { x: 2700, y: 230, width: 35, height: 30, type: 'computer' },
  { x: 3250, y: 260, width: 35, height: 30, type: 'computer' },
  { x: 3850, y: 230, width: 35, height: 30, type: 'computer' },
  
  // Paperclips (smaller obstacles)
  { x: 450, y: 260, width: 15, height: 15, type: 'paperclip' },
  { x: 720, y: 230, width: 15, height: 15, type: 'paperclip' },
  { x: 1020, y: 260, width: 15, height: 15, type: 'paperclip' },
  { x: 1250, y: 200, width: 15, height: 15, type: 'paperclip' },
  { x: 1550, y: 230, width: 15, height: 15, type: 'paperclip' },
  { x: 1850, y: 160, width: 15, height: 15, type: 'paperclip' },
  { x: 2150, y: 130, width: 15, height: 15, type: 'paperclip' },
  { x: 2400, y: 210, width: 15, height: 15, type: 'paperclip' },
  { x: 2850, y: 260, width: 15, height: 15, type: 'paperclip' },
  { x: 3350, y: 230, width: 15, height: 15, type: 'paperclip' },
  { x: 3750, y: 200, width: 15, height: 15, type: 'paperclip' },
  { x: 4050, y: 230, width: 15, height: 15, type: 'paperclip' },
];

// Collectibles (face in yellow circle replacing coffee cups and documents)
export const initialCoins: Coin[] = [
  // First row of collectibles (former coffee cups)
  { x: 200, y: 300, width: 25, height: 25, collected: false, type: 'point' },
  { x: 550, y: 200, width: 25, height: 25, collected: false, type: 'point' },
  { x: 850, y: 300, width: 25, height: 25, collected: false, type: 'point' },
  { x: 1100, y: 170, width: 25, height: 25, collected: false, type: 'point' },
  { x: 1350, y: 200, width: 25, height: 25, collected: false, type: 'point' },
  { x: 1650, y: 150, width: 25, height: 25, collected: false, type: 'point' },
  { x: 1950, y: 300, width: 25, height: 25, collected: false, type: 'point' },
  { x: 2250, y: 180, width: 25, height: 25, collected: false, type: 'point' },
  { x: 2650, y: 300, width: 25, height: 25, collected: false, type: 'point' },
  { x: 3000, y: 200, width: 25, height: 25, collected: false, type: 'point' },
  { x: 3300, y: 300, width: 25, height: 25, collected: false, type: 'point' },
  { x: 3650, y: 170, width: 25, height: 25, collected: false, type: 'point' },
  { x: 4000, y: 300, width: 25, height: 25, collected: false, type: 'point' },
  
  // Second row of collectibles (former documents)
  { x: 350, y: 150, width: 25, height: 25, collected: false, type: 'point' },
  { x: 700, y: 120, width: 25, height: 25, collected: false, type: 'point' },
  { x: 950, y: 120, width: 25, height: 25, collected: false, type: 'point' },
  { x: 1200, y: 300, width: 25, height: 25, collected: false, type: 'point' },
  { x: 1450, y: 140, width: 25, height: 25, collected: false, type: 'point' },
  { x: 1750, y: 170, width: 25, height: 25, collected: false, type: 'point' },
  { x: 2000, y: 100, width: 25, height: 25, collected: false, type: 'point' },
  { x: 2350, y: 200, width: 25, height: 25, collected: false, type: 'point' },
  { x: 2500, y: 140, width: 25, height: 25, collected: false, type: 'point' },
  { x: 2850, y: 120, width: 25, height: 25, collected: false, type: 'point' },
  { x: 3200, y: 140, width: 25, height: 25, collected: false, type: 'point' },
  { x: 3500, y: 200, width: 25, height: 25, collected: false, type: 'point' },
  { x: 3800, y: 120, width: 25, height: 25, collected: false, type: 'point' },
  { x: 4100, y: 150, width: 25, height: 25, collected: false, type: 'point' },
];

export const initialCharacter: GameCharacter = {
  x: 100,
  y: 200,
  width: 30,
  height: 40,
  velocityX: 0,
  velocityY: 0,
  isJumping: false
};
