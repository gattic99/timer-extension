
import { GameCharacter } from "@/types/gameTypes";

// Draw character
export const drawCharacter = (ctx: CanvasRenderingContext2D, character: GameCharacter) => {
  console.log("Drawing character at:", character.x, character.y);
  
  // Body (shirt)
  ctx.fillStyle = '#3F51B5'; // Blue shirt
  ctx.fillRect(character.x, character.y, character.width, character.height - 15);
  
  // Pants
  ctx.fillStyle = '#212121'; // Dark pants
  ctx.fillRect(character.x, character.y + character.height - 15, character.width, 15);
  
  // Head
  ctx.fillStyle = '#FFE0B2'; // Skin tone
  ctx.beginPath();
  ctx.arc(character.x + character.width / 2, character.y - 5, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // Hair
  ctx.fillStyle = '#5D4037'; // Brown hair
  ctx.beginPath();
  ctx.arc(character.x + character.width / 2, character.y - 10, 8, 0, Math.PI, true);
  ctx.fill();
};
