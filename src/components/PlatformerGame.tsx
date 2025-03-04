
import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "@/utils/timerUtils";
import { TimerState } from "@/types";
import { ArrowLeft, ArrowRight, ArrowUp, Play, Pause } from "lucide-react";

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
}

interface Coin {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
}

const PlatformerGame: React.FC<PlatformerGameProps> = ({ onReturn, timerState }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const characterRef = useRef<GameCharacter>({
    x: 50,
    y: 200,
    width: 30,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    isJumping: false
  });
  
  const platformsRef = useRef<Platform[]>([
    { x: 0, y: 350, width: 200, height: 20 },
    { x: 250, y: 350, width: 200, height: 20 },
    { x: 500, y: 350, width: 200, height: 20 },
    { x: 150, y: 250, width: 100, height: 20 },
    { x: 400, y: 200, width: 100, height: 20 }
  ]);
  
  const coinsRef = useRef<Coin[]>([
    { x: 100, y: 300, width: 20, height: 20, collected: false },
    { x: 300, y: 300, width: 20, height: 20, collected: false },
    { x: 550, y: 300, width: 20, height: 20, collected: false },
    { x: 180, y: 200, width: 20, height: 20, collected: false },
    { x: 430, y: 150, width: 20, height: 20, collected: false }
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
      x: 50,
      y: 200,
      width: 30,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      isJumping: false
    };
    
    coinsRef.current = coinsRef.current.map(coin => ({ ...coin, collected: false }));
    setScore(0);
  };
  
  const updateGame = () => {
    const character = characterRef.current;
    
    if (keysRef.current.left) character.velocityX = -5;
    else if (keysRef.current.right) character.velocityX = 5;
    else character.velocityX = 0;
    
    if (keysRef.current.up && !character.isJumping) {
      character.velocityY = -12;
      character.isJumping = true;
    }
    
    character.velocityY += 0.5;
    
    character.x += character.velocityX;
    character.y += character.velocityY;
    
    if (character.x < 0) character.x = 0;
    if (character.x + character.width > 700) character.x = 700 - character.width;
    
    let onPlatform = false;
    platformsRef.current.forEach(platform => {
      if (
        character.x + character.width > platform.x &&
        character.x < platform.x + platform.width &&
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
    
    if (character.y > 400) {
      resetGame();
    }
    
    // Check for coin collection and update score
    coinsRef.current.forEach((coin, index) => {
      if (
        !coin.collected &&
        character.x + character.width > coin.x &&
        character.x < coin.x + coin.width &&
        character.y + character.height > coin.y &&
        character.y < coin.y + coin.height
      ) {
        coinsRef.current[index].collected = true;
        // Important: Use a function to update score based on previous state
        setScore(prevScore => prevScore + 10);
      }
    });
  };
  
  const renderGame = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 700, 400);
    
    // Draw sky background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, 700, 400);
    
    // Draw platforms
    ctx.fillStyle = '#8B4513';
    platformsRef.current.forEach(platform => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      ctx.strokeStyle = '#3E2723';
      ctx.lineWidth = 1;
      for (let i = 0; i < platform.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(platform.x + i, platform.y);
        ctx.lineTo(platform.x + i, platform.y + platform.height);
        ctx.stroke();
      }
      
      for (let i = 0; i < platform.height; i += 10) {
        ctx.beginPath();
        ctx.moveTo(platform.x, platform.y + i);
        ctx.lineTo(platform.x + platform.width, platform.y + i);
        ctx.stroke();
      }
    });
    
    // Draw coins
    coinsRef.current.forEach(coin => {
      if (!coin.collected) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    
    // Draw character
    const character = characterRef.current;
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(character.x, character.y, character.width, character.height);
    
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(character.x, character.y + character.height - 15, character.width, 15);
    ctx.fillStyle = '#A52A2A';
    ctx.fillRect(character.x, character.y, character.width, 10);
    ctx.fillStyle = '#FFA07A';
    ctx.fillRect(character.x + 5, character.y + 10, character.width - 10, 15);
    
    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
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
    <div className="fixed inset-x-0 bottom-0 w-full animate-scale-in flex flex-col items-center bg-blue-100 pb-4">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-focus-purple">Platformer Adventure</h2>
        <p className="text-muted-foreground text-sm">
          Collect coins and jump between platforms!
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
      
      <div className="flex justify-center mt-4">
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
