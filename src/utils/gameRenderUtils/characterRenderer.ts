
import { GameCharacter } from "@/types/gameTypes";

// Draw character
export const drawCharacter = (ctx: CanvasRenderingContext2D, character: GameCharacter) => {
  console.log("Drawing character at:", character.x, character.y);
  
  // Determine a consistent character variant based on position
  const characterVariant = Math.floor(character.x / 500) % 3;
  
  if (characterVariant === 0) {
    // Default business character
    // Body (blue shirt)
    ctx.fillStyle = '#3F51B5';
    ctx.fillRect(character.x, character.y, character.width, character.height - 15);
    
    // Pants
    ctx.fillStyle = '#212121';
    ctx.fillRect(character.x, character.y + character.height - 15, character.width, 15);
    
    // Head
    ctx.fillStyle = '#FFE0B2';
    ctx.beginPath();
    ctx.arc(character.x + character.width / 2, character.y - 5, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.arc(character.x + character.width / 2, character.y - 10, 8, 0, Math.PI, true);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(character.x + character.width/2 - 4, character.y - 7, 2, 0, Math.PI * 2);
    ctx.arc(character.x + character.width/2 + 4, character.y - 7, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile
    ctx.beginPath();
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1;
    ctx.arc(character.x + character.width/2, character.y - 2, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();
  } 
  else if (characterVariant === 1) {
    // Casual tech worker
    // Body (hoodie)
    ctx.fillStyle = '#009688'; // Teal hoodie
    ctx.fillRect(character.x, character.y, character.width, character.height - 15);
    ctx.fillStyle = '#00796B'; // Hood
    ctx.fillRect(character.x - 2, character.y, character.width + 4, 5);
    
    // Jeans
    ctx.fillStyle = '#1976D2'; // Blue jeans
    ctx.fillRect(character.x, character.y + character.height - 15, character.width, 15);
    
    // Head
    ctx.fillStyle = '#FFCCBC'; // Different skin tone
    ctx.beginPath();
    ctx.arc(character.x + character.width / 2, character.y - 5, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Short spiky hair
    ctx.fillStyle = '#212121'; // Dark hair
    for (let i = -6; i <= 6; i += 4) {
      ctx.beginPath();
      ctx.moveTo(character.x + character.width/2 + i, character.y - 16);
      ctx.lineTo(character.x + character.width/2 + i + 2, character.y - 10);
      ctx.lineTo(character.x + character.width/2 + i - 2, character.y - 10);
      ctx.fill();
    }
    
    // Glasses
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 1;
    ctx.beginPath(); 
    ctx.arc(character.x + character.width/2 - 4, character.y - 7, 3, 0, Math.PI * 2);
    ctx.arc(character.x + character.width/2 + 4, character.y - 7, 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // Neutral expression
    ctx.beginPath();
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1;
    ctx.moveTo(character.x + character.width/2 - 3, character.y - 1);
    ctx.lineTo(character.x + character.width/2 + 3, character.y - 1);
    ctx.stroke();
  }
  else {
    // Creative office worker
    // Body (colorful shirt)
    ctx.fillStyle = '#E91E63'; // Pink shirt
    ctx.fillRect(character.x, character.y, character.width, character.height - 15);
    
    // Pants
    ctx.fillStyle = '#424242'; // Gray pants
    ctx.fillRect(character.x, character.y + character.height - 15, character.width, 15);
    
    // Head
    ctx.fillStyle = '#FBC02D'; // Different skin tone
    ctx.beginPath();
    ctx.arc(character.x + character.width / 2, character.y - 5, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Long colorful hair
    ctx.fillStyle = '#7E57C2'; // Purple hair
    ctx.beginPath();
    ctx.arc(character.x + character.width / 2, character.y - 12, 10, 0, Math.PI, true);
    ctx.fill();
    // Hair sides
    ctx.fillRect(character.x + character.width/2 - 10, character.y - 12, 5, 18);
    ctx.fillRect(character.x + character.width/2 + 5, character.y - 12, 5, 18);
    
    // Eyes
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(character.x + character.width/2 - 4, character.y - 7, 1.5, 0, Math.PI * 2);
    ctx.arc(character.x + character.width/2 + 4, character.y - 7, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile
    ctx.beginPath();
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1;
    ctx.arc(character.x + character.width/2, character.y - 3, 4, 0, Math.PI);
    ctx.stroke();
  }
};
