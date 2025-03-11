
import { GameState } from "@/types/gameTypes";

// Draw the office background and floor grid
export const drawBackground = (ctx: CanvasRenderingContext2D, cameraOffsetX: number) => {
  // Clear canvas
  ctx.clearRect(0, 0, 700, 400);
  
  // Determine background section based on camera position (create different office sections)
  const bgSection = Math.floor(cameraOffsetX / 1000) % 2;
  
  if (bgSection === 0) {
    // Conference room area with blue tones
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#E3F2FD'); // Light blue ceiling
    gradient.addColorStop(1, '#BBDEFB'); // Slightly darker blue floor
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 700, 400);
    
    // Conference room backdrop
    ctx.fillStyle = '#90CAF9';
    ctx.fillRect(0, 30, 700, 120);
    
    // Conference room windows
    for (let i = 50; i < 650; i += 120) {
      // Window frame
      ctx.fillStyle = '#42A5F5';
      ctx.fillRect(i, 40, 80, 100);
      
      // Window glass
      ctx.fillStyle = '#E1F5FE';
      ctx.fillRect(i + 5, 45, 70, 90);
    }
    
    // Blue accent stripe
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(0, 150, 700, 10);
  }
  else {
    // Break room area with warmer colors
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#FFECB3'); // Light warm ceiling
    gradient.addColorStop(1, '#FFE082'); // Slightly darker warm floor
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 700, 400);
    
    // Break room wall decoration
    ctx.fillStyle = '#FFA726';
    ctx.fillRect(0, 40, 700, 110);
    
    // Fridge and vending machines
    ctx.fillStyle = '#78909C';
    ctx.fillRect(150, 60, 60, 90); // Fridge
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(155, 65, 50, 80); // Fridge door
    
    ctx.fillStyle = '#455A64';
    ctx.fillRect(350, 60, 70, 90); // Vending machine
    ctx.fillStyle = '#BBDEFB';
    ctx.fillRect(355, 65, 60, 70); // Vending machine glass
    
    // Orange accent stripe
    ctx.fillStyle = '#FF9800';
    ctx.fillRect(0, 150, 700, 10);
  }
  
  // Floor grid pattern with parallax effect - common to all sections
  ctx.strokeStyle = '#DEDEDE';
  ctx.lineWidth = 1;
  
  // Create different floor patterns based on section
  if (bgSection === 0) {
    // Conference room floor - diamond pattern
    ctx.strokeStyle = '#90CAF9';
    for (let i = 0; i < 700; i += 70) {
      const offset = cameraOffsetX % 70;
      for (let j = 200; j <= 400; j += 70) {
        ctx.beginPath();
        ctx.moveTo(i - offset + 35, j);
        ctx.lineTo(i - offset, j + 35);
        ctx.lineTo(i - offset + 35, j + 70);
        ctx.lineTo(i - offset + 70, j + 35);
        ctx.closePath();
        ctx.stroke();
      }
    }
  } else {
    // Break room floor - tile pattern
    ctx.strokeStyle = '#FFA726';
    for (let i = 0; i < 700; i += 60) {
      const offset = cameraOffsetX % 60;
      for (let j = 200; j <= 400; j += 60) {
        ctx.strokeRect(i - offset, j, 60, 60);
      }
    }
  }
  
  // Add some office plants or furniture as silhouettes - varies by section
  if (bgSection === 0) {
    // Conference room chairs
    const chairPositions = [120, 220, 320, 420, 520];
    chairPositions.forEach(position => {
      const adjustedX = position - (cameraOffsetX % 700);
      if (adjustedX > -50 && adjustedX < 750) {
        // Chair back
        ctx.fillStyle = '#0D47A1';
        ctx.fillRect(adjustedX - 10, 170, 20, 15);
        
        // Chair seat
        ctx.fillStyle = '#1565C0';
        ctx.fillRect(adjustedX - 15, 185, 30, 5);
      }
    });
  } else {
    // Break room furniture - small round tables
    const tablePositions = [150, 350, 550];
    tablePositions.forEach(position => {
      const adjustedX = position - (cameraOffsetX % 700);
      if (adjustedX > -50 && adjustedX < 750) {
        // Table top
        ctx.fillStyle = '#5D4037';
        ctx.beginPath();
        ctx.arc(adjustedX, 185, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Table base
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(adjustedX - 5, 185, 10, 15);
      }
    });
  }
};
