
import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "@/utils/timerUtils";
import { TimerState } from "@/types";
import { ArrowLeft, ArrowRight, ArrowUp, Play, Pause, Briefcase, Monitor, Table, Printer, Paperclip, Trash, Computer } from "lucide-react";
import { toast } from "sonner";

interface PlatformerGameProps {
  onReturn: () => void;
  timerState: TimerState;
}

interface GameCharacter {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'desk' | 'floor' | 'shelf';
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'chair' | 'trash' | 'printer' | 'computer' | 'paperclip';
}

interface Coin {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  type: 'coffee' | 'document';
}

interface GameState {
  score: number;
  cameraOffsetX: number;
  worldPosition: number;
}

const PlatformerGame: React.FC<PlatformerGameProps> = ({ onReturn, timerState }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    cameraOffsetX: 0,
    worldPosition: 0
  });
  const [gameStarted, setGameStarted] = useState(false);
  
  const characterRef = useRef<GameCharacter>({
    x: 100,
    y: 200,
    width: 30,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    isJumping: false
  });
  
  // Office-themed platforms (desks, floors, shelves)
  const platformsRef = useRef<Platform[]>([
    // Main floor sections
    { x: 0, y: 350, width: 800, height: 20, type: 'floor' },
    { x: 850, y: 350, width: 400, height: 20, type: 'floor' },
    { x: 1300, y: 350, width: 600, height: 20, type: 'floor' },
    { x: 2000, y: 350, width: 500, height: 20, type: 'floor' },
    { x: 2600, y: 350, width: 400, height: 20, type: 'floor' },
    
    // Desks (platforms at various heights)
    { x: 250, y: 280, width: 200, height: 15, type: 'desk' },
    { x: 600, y: 250, width: 150, height: 15, type: 'desk' },
    { x: 900, y: 280, width: 180, height: 15, type: 'desk' },
    { x: 1150, y: 220, width: 120, height: 15, type: 'desk' },
    { x: 1400, y: 250, width: 200, height: 15, type: 'desk' },
    { x: 1700, y: 200, width: 150, height: 15, type: 'desk' },
    { x: 2050, y: 280, width: 180, height: 15, type: 'desk' },
    { x: 2300, y: 230, width: 200, height: 15, type: 'desk' },
    
    // Shelves (higher platforms)
    { x: 400, y: 180, width: 100, height: 10, type: 'shelf' },
    { x: 750, y: 150, width: 100, height: 10, type: 'shelf' },
    { x: 1050, y: 150, width: 80, height: 10, type: 'shelf' },
    { x: 1500, y: 170, width: 120, height: 10, type: 'shelf' },
    { x: 1900, y: 130, width: 100, height: 10, type: 'shelf' },
    { x: 2200, y: 150, width: 80, height: 10, type: 'shelf' },
    { x: 2450, y: 170, width: 100, height: 10, type: 'shelf' },
  ]);
  
  // Office obstacles (chairs, trash bins, printers, etc.)
  const obstaclesRef = useRef<Obstacle[]>([
    // Chairs
    { x: 300, y: 240, width: 40, height: 40, type: 'chair' },
    { x: 670, y: 210, width: 40, height: 40, type: 'chair' },
    { x: 970, y: 240, width: 40, height: 40, type: 'chair' },
    { x: 1470, y: 210, width: 40, height: 40, type: 'chair' },
    { x: 2120, y: 240, width: 40, height: 40, type: 'chair' },
    
    // Trash bins
    { x: 500, y: 330, width: 30, height: 40, type: 'trash' },
    { x: 1100, y: 330, width: 30, height: 40, type: 'trash' },
    { x: 1600, y: 330, width: 30, height: 40, type: 'trash' },
    { x: 2200, y: 330, width: 30, height: 40, type: 'trash' },
    
    // Printers
    { x: 350, y: 265, width: 50, height: 25, type: 'printer' },
    { x: 1200, y: 205, width: 50, height: 25, type: 'printer' },
    { x: 1800, y: 185, width: 50, height: 25, type: 'printer' },
    
    // Computers
    { x: 280, y: 260, width: 35, height: 30, type: 'computer' },
    { x: 950, y: 260, width: 35, height: 30, type: 'computer' },
    { x: 1450, y: 230, width: 35, height: 30, type: 'computer' },
    { x: 2100, y: 260, width: 35, height: 30, type: 'computer' },
    
    // Paperclips (smaller obstacles)
    { x: 450, y: 260, width: 15, height: 15, type: 'paperclip' },
    { x: 720, y: 230, width: 15, height: 15, type: 'paperclip' },
    { x: 1020, y: 260, width: 15, height: 15, type: 'paperclip' },
    { x: 1250, y: 200, width: 15, height: 15, type: 'paperclip' },
    { x: 1550, y: 230, width: 15, height: 15, type: 'paperclip' },
    { x: 1850, y: 160, width: 15, height: 15, type: 'paperclip' },
    { x: 2150, y: 130, width: 15, height: 15, type: 'paperclip' },
    { x: 2400, y: 210, width: 15, height: 15, type: 'paperclip' },
  ]);
  
  // Collectibles (coffee cups and documents)
  const coinsRef = useRef<Coin[]>([
    // Coffee cups
    { x: 200, y: 300, width: 20, height: 20, collected: false, type: 'coffee' },
    { x: 550, y: 200, width: 20, height: 20, collected: false, type: 'coffee' },
    { x: 850, y: 300, width: 20, height: 20, collected: false, type: 'coffee' },
    { x: 1100, y: 170, width: 20, height: 20, collected: false, type: 'coffee' },
    { x: 1350, y: 200, width: 20, height: 20, collected: false, type: 'coffee' },
    { x: 1650, y: 150, width: 20, height: 20, collected: false, type: 'coffee' },
    { x: 1950, y: 300, width: 20, height: 20, collected: false, type: 'coffee' },
    { x: 2250, y: 180, width: 20, height: 20, collected: false, type: 'coffee' },
    
    // Documents (important papers)
    { x: 350, y: 150, width: 20, height: 20, collected: false, type: 'document' },
    { x: 700, y: 120, width: 20, height: 20, collected: false, type: 'document' },
    { x: 950, y: 120, width: 20, height: 20, collected: false, type: 'document' },
    { x: 1200, y: 300, width: 20, height: 20, collected: false, type: 'document' },
    { x: 1450, y: 140, width: 20, height: 20, collected: false, type: 'document' },
    { x: 1750, y: 170, width: 20, height: 20, collected: false, type: 'document' },
    { x: 2000, y: 100, width: 20, height: 20, collected: false, type: 'document' },
    { x: 2350, y: 200, width: 20, height: 20, collected: false, type: 'document' },
    { x: 2500, y: 140, width: 20, height: 20, collected: false, type: 'document' },
  ]);
  
  const keysRef = useRef({
    left: false,
    right: false,
    up: false
  });
  
  useEffect(() => {
    setGameStarted(true);
    resetGame();
  }, []);
  
  useEffect(() => {
    if (!gameStarted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameLoop = setInterval(() => {
      updateGame();
      renderGame(ctx);
    }, 16); // ~60 FPS
    
    return () => clearInterval(gameLoop);
  }, [gameStarted]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') keysRef.current.up = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') keysRef.current.up = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  const resetGame = () => {
    characterRef.current = {
      x: 100,
      y: 200,
      width: 30,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      isJumping: false
    };
    
    coinsRef.current = coinsRef.current.map(coin => ({ ...coin, collected: false }));
    setGameState({
      score: 0,
      cameraOffsetX: 0,
      worldPosition: 0
    });
  };

  const updateGame = () => {
    const character = characterRef.current;
    const canvasWidth = canvasRef.current?.width || 700;
    
    // Handle character movement
    if (keysRef.current.left) character.velocityX = -5;
    else if (keysRef.current.right) character.velocityX = 5;
    else character.velocityX = 0;
    
    if (keysRef.current.up && !character.isJumping) {
      character.velocityY = -12;
      character.isJumping = true;
    }
    
    character.velocityY += 0.5; // Gravity
    
    // Update world position based on character velocity
    if (character.velocityX > 0) {
      // Moving right - advance world position
      character.x += character.velocityX / 2; // Move character slightly for visual feedback
      
      // If character is beyond center point, scroll world instead of moving character
      if (character.x > canvasWidth / 2) {
        character.x = canvasWidth / 2; // Keep character in center
        setGameState(prev => ({
          ...prev,
          worldPosition: prev.worldPosition + character.velocityX,
          cameraOffsetX: prev.cameraOffsetX + character.velocityX
        }));
      }
    } else if (character.velocityX < 0) {
      // Moving left - retreat world position (but don't go below 0)
      if (gameState.worldPosition > 0) {
        character.x -= Math.abs(character.velocityX) / 2; // Move character slightly for visual feedback
        
        // If character is left of center and we're not at world start
        if (character.x < canvasWidth / 2 && gameState.worldPosition > 0) {
          character.x = canvasWidth / 2; // Keep character in center
          setGameState(prev => {
            const newWorldPos = Math.max(0, prev.worldPosition + character.velocityX);
            const newCameraOffset = Math.max(0, prev.cameraOffsetX + character.velocityX);
            return {
              ...prev,
              worldPosition: newWorldPos,
              cameraOffsetX: newCameraOffset
            };
          });
        }
      } else {
        // At beginning of world, allow character to move left until edge
        character.x += character.velocityX;
        if (character.x < 0) character.x = 0;
      }
    }
    
    // Apply vertical movement
    character.y += character.velocityY;
    
    // Check for platform collisions
    let onPlatform = false;
    platformsRef.current.forEach(platform => {
      if (
        character.x + character.width > platform.x - gameState.cameraOffsetX &&
        character.x < platform.x - gameState.cameraOffsetX + platform.width &&
        character.y + character.height >= platform.y &&
        character.y + character.height <= platform.y + platform.height / 2 &&
        character.velocityY > 0
      ) {
        character.y = platform.y - character.height;
        character.velocityY = 0;
        character.isJumping = false;
        onPlatform = true;
      }
    });
    
    // Check for obstacle collisions
    obstaclesRef.current.forEach(obstacle => {
      if (
        character.x + character.width > obstacle.x - gameState.cameraOffsetX &&
        character.x < obstacle.x - gameState.cameraOffsetX + obstacle.width &&
        character.y + character.height > obstacle.y &&
        character.y < obstacle.y + obstacle.height
      ) {
        // Hit obstacle - reset position and lose points
        toast.error("You hit an office obstacle!");
        character.x = Math.max(0, character.x - 50);
        character.y = 200;
        character.velocityY = 0;
        setGameState(prev => ({
          ...prev,
          score: Math.max(0, prev.score - 5)
        }));
      }
    });
    
    // Check if character fell off the bottom
    if (character.y > 400) {
      toast.error("Game over! Starting again...");
      resetGame();
    }
    
    // Check for coin collection
    coinsRef.current.forEach((coin, index) => {
      if (
        !coin.collected &&
        character.x + character.width > coin.x - gameState.cameraOffsetX &&
        character.x < coin.x - gameState.cameraOffsetX + coin.width &&
        character.y + character.height > coin.y &&
        character.y < coin.y + coin.height
      ) {
        coinsRef.current[index].collected = true;
        const points = coin.type === 'coffee' ? 10 : 20; // Documents worth more
        setGameState(prev => ({
          ...prev,
          score: prev.score + points
        }));
        toast.success(`+${points} points!`);
      }
    });
  };
  
  const renderGame = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 700, 400);
    
    // Draw office background
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#F1F1F1'); // Light gray for ceiling
    gradient.addColorStop(1, '#E6E6E6'); // Slightly darker for floor
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 700, 400);
    
    // Draw floor grid pattern
    ctx.strokeStyle = '#DEDEDE';
    ctx.lineWidth = 1;
    for (let i = 0; i < 700; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 400);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(700, i);
      ctx.stroke();
    }
    
    // Draw platforms with camera offset
    platformsRef.current.forEach(platform => {
      const adjustedX = platform.x - gameState.cameraOffsetX;
      
      // Only render platforms that are visible on screen
      if (adjustedX < 700 && adjustedX + platform.width > 0) {
        if (platform.type === 'floor') {
          // Floor - dark gray carpet
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
        } else if (platform.type === 'desk') {
          // Desk - wooden brown
          ctx.fillStyle = '#A67C52';
          ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
          
          // Add wood grain texture
          ctx.strokeStyle = '#8B5A2B';
          ctx.lineWidth = 0.5;
          for (let i = 0; i < platform.width; i += 15) {
            ctx.beginPath();
            ctx.moveTo(adjustedX + i, platform.y);
            ctx.lineTo(adjustedX + i, platform.y + platform.height);
            ctx.stroke();
          }
        } else if (platform.type === 'shelf') {
          // Shelf - light wooden color
          ctx.fillStyle = '#D2B48C';
          ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
          
          // Add shelf brackets
          ctx.fillStyle = '#A9A9A9';
          ctx.fillRect(adjustedX + 5, platform.y, 5, 15);
          ctx.fillRect(adjustedX + platform.width - 10, platform.y, 5, 15);
        }
      }
    });
    
    // Draw obstacles with camera offset
    obstaclesRef.current.forEach(obstacle => {
      const adjustedX = obstacle.x - gameState.cameraOffsetX;
      
      // Only render obstacles that are visible on screen
      if (adjustedX < 700 && adjustedX + obstacle.width > 0) {
        if (obstacle.type === 'chair') {
          // Office chair
          ctx.fillStyle = '#2E2E2E';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height - 10);
          
          // Chair base
          ctx.fillStyle = '#424242';
          ctx.fillRect(adjustedX + 10, obstacle.y + obstacle.height - 10, obstacle.width - 20, 10);
          
          // Chair wheels
          ctx.fillStyle = '#1A1A1A';
          ctx.beginPath();
          ctx.arc(adjustedX + 10, obstacle.y + obstacle.height, 5, 0, Math.PI * 2);
          ctx.arc(adjustedX + obstacle.width - 10, obstacle.y + obstacle.height, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (obstacle.type === 'trash') {
          // Trash bin
          ctx.fillStyle = '#4CAF50';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
          
          // Trash lid
          ctx.fillStyle = '#388E3C';
          ctx.fillRect(adjustedX - 2, obstacle.y, obstacle.width + 4, 5);
          
          // Trash contents
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(adjustedX + 5, obstacle.y + 10, 5, 8);
          ctx.fillRect(adjustedX + 15, obstacle.y + 8, 8, 5);
        } else if (obstacle.type === 'printer') {
          // Printer
          ctx.fillStyle = '#424242';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height);
          
          // Printer details
          ctx.fillStyle = '#212121';
          ctx.fillRect(adjustedX + 5, obstacle.y + 5, obstacle.width - 10, 10);
          
          // Paper tray
          ctx.fillStyle = '#BDBDBD';
          ctx.fillRect(adjustedX, obstacle.y + obstacle.height - 5, obstacle.width, 5);
        } else if (obstacle.type === 'computer') {
          // Computer monitor
          ctx.fillStyle = '#212121';
          ctx.fillRect(adjustedX, obstacle.y, obstacle.width, obstacle.height - 5);
          
          // Screen
          ctx.fillStyle = '#2196F3';
          ctx.fillRect(adjustedX + 2, obstacle.y + 2, obstacle.width - 4, obstacle.height - 9);
          
          // Computer base
          ctx.fillStyle = '#616161';
          ctx.fillRect(adjustedX + 10, obstacle.y + obstacle.height - 5, obstacle.width - 20, 5);
        } else if (obstacle.type === 'paperclip') {
          // Paperclip
          ctx.fillStyle = '#9E9E9E';
          ctx.beginPath();
          ctx.arc(adjustedX + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(adjustedX + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
    
    // Draw collectibles with camera offset
    coinsRef.current.forEach(coin => {
      if (!coin.collected) {
        const adjustedX = coin.x - gameState.cameraOffsetX;
        
        // Only render coins that are visible on screen
        if (adjustedX < 700 && adjustedX + coin.width > 0) {
          if (coin.type === 'coffee') {
            // Coffee cup
            ctx.fillStyle = '#795548';
            ctx.fillRect(adjustedX, coin.y, coin.width, coin.height);
            
            // Coffee cup details
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(adjustedX + 2, coin.y + 2, coin.width - 4, coin.height / 2 - 2);
            
            // Coffee
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(adjustedX + 2, coin.y + coin.height / 2, coin.width - 4, coin.height / 2 - 2);
          } else {
            // Document
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(adjustedX, coin.y, coin.width, coin.height);
            
            // Document lines
            ctx.strokeStyle = '#9E9E9E';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
              ctx.beginPath();
              ctx.moveTo(adjustedX + 2, coin.y + 4 + i * 4);
              ctx.lineTo(adjustedX + coin.width - 2, coin.y + 4 + i * 4);
              ctx.stroke();
            }
          }
        }
      }
    });
    
    // Draw character as office worker
    const character = characterRef.current;
    
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
    
    // Draw score directly on canvas
    ctx.fillStyle = '#000';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    
    // Draw timer
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(formatTime(timerState.timeRemaining), 10, 60);
    
    // Draw instructions
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText('Arrow Keys/WASD to move, Up/Space to jump', 400, 20);
  };
  
  const handleLeftPress = () => {
    keysRef.current.left = true;
  };
  
  const handleLeftRelease = () => {
    keysRef.current.left = false;
  };
  
  const handleRightPress = () => {
    keysRef.current.right = true;
  };
  
  const handleRightRelease = () => {
    keysRef.current.right = false;
  };
  
  const handleJumpPress = () => {
    keysRef.current.up = true;
  };
  
  const handleJumpRelease = () => {
    keysRef.current.up = false;
  };

  return (
    <div className="fixed inset-0 top-auto bottom-0 w-full h-screen bg-blue-100 z-50 flex flex-col items-center">
      <div className="text-center mt-4 mb-2">
        <h2 className="text-xl font-bold text-focus-purple">Office Escape</h2>
        <p className="text-muted-foreground text-sm">
          Collect coffee cups and documents while avoiding office obstacles!
        </p>
      </div>
      
      <div className="relative w-full max-w-4xl mx-auto">
        <canvas 
          ref={canvasRef} 
          width={700} 
          height={400} 
          className="bg-white border border-gray-200 rounded-lg shadow-md mx-auto"
        />
        
        <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md z-10">
          {formatTime(timerState.timeRemaining)}
        </div>
        
        <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md z-10">
          Score: {gameState.score}
        </div>
        
        <div className="flex justify-between mt-2 md:hidden">
          <div className="flex gap-2">
            <button
              className="bg-focus-purple text-white p-3 rounded-full"
              onTouchStart={handleLeftPress}
              onTouchEnd={handleLeftRelease}
              onMouseDown={handleLeftPress}
              onMouseUp={handleLeftRelease}
              onMouseLeave={handleLeftRelease}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              className="bg-focus-purple text-white p-3 rounded-full"
              onTouchStart={handleRightPress}
              onTouchEnd={handleRightRelease}
              onMouseDown={handleRightPress}
              onMouseUp={handleRightRelease}
              onMouseLeave={handleRightRelease}
            >
              <ArrowRight size={20} />
            </button>
          </div>
          <button
            className="bg-focus-purple text-white p-3 rounded-full"
            onTouchStart={handleJumpPress}
            onTouchEnd={handleJumpRelease}
            onMouseDown={handleJumpPress}
            onMouseUp={handleJumpRelease}
            onMouseLeave={handleJumpRelease}
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex justify-center mt-4 mb-6">
        <button 
          onClick={onReturn} 
          className="bg-white text-focus-purple border border-focus-purple px-6 py-2 rounded-full hover:bg-focus-purple hover:text-white transition-colors"
        >
          Return to Timer
        </button>
      </div>
    </div>
  );
};

export default PlatformerGame;
