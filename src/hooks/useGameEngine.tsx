
import { useState, useRef, useEffect } from 'react';
import { 
  GameCharacter, 
  Platform, 
  Obstacle, 
  Coin, 
  GameState, 
  GameKeys 
} from '@/types/gameTypes';
import { 
  checkPlatformCollisions, 
  checkObstacleCollisions, 
  checkFallOffScreen, 
  checkCoinCollection,
  updateCharacterMovement
} from '@/utils/gameLogicUtils';

interface UseGameEngineProps {
  initialCharacter: GameCharacter;
  initialPlatforms: Platform[];
  initialObstacles: Obstacle[];
  initialCoins: Coin[];
}

const useGameEngine = ({
  initialCharacter,
  initialPlatforms,
  initialObstacles,
  initialCoins
}: UseGameEngineProps) => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    cameraOffsetX: 0,
    worldPosition: 0,
    gameOver: false
  });
  
  const [gameStarted, setGameStarted] = useState(false);
  
  const characterRef = useRef<GameCharacter>({...initialCharacter});
  const platformsRef = useRef<Platform[]>(initialPlatforms);
  const obstaclesRef = useRef<Obstacle[]>(initialObstacles);
  const coinsRef = useRef<Coin[]>(initialCoins.map(coin => ({...coin})));
  const keysRef = useRef<GameKeys>({
    left: false,
    right: false,
    up: false
  });
  
  const canvasWidthRef = useRef<number>(700);
  
  const resetGame = () => {
    characterRef.current = {...initialCharacter};
    coinsRef.current = initialCoins.map(coin => ({...coin}));
    setGameState({
      score: 0,
      cameraOffsetX: 0,
      worldPosition: 0,
      gameOver: false
    });
  };

  const updateGame = () => {
    if (gameState.gameOver) return;
    
    const character = characterRef.current;
    canvasWidthRef.current = 700; // Default canvas width
    
    // Update character position with current key states
    updateCharacterMovement(
      character,
      keysRef.current,
      canvasWidthRef.current,
      gameState,
      setGameState
    );
    
    // Check for platform collisions
    checkPlatformCollisions(character, platformsRef.current, gameState.cameraOffsetX);
    
    // Check for obstacle collisions - now fatal
    if (checkObstacleCollisions(character, obstaclesRef.current, gameState.cameraOffsetX)) {
      setGameState(prev => ({
        ...prev,
        gameOver: true
      }));
      return;
    }
    
    // Check if character fell off the bottom
    if (checkFallOffScreen(character)) {
      setGameState(prev => ({
        ...prev,
        gameOver: true
      }));
      return;
    }
    
    // Check for coin collection
    const scoreIncrease = checkCoinCollection(character, coinsRef.current, gameState.cameraOffsetX);
    if (scoreIncrease > 0) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + scoreIncrease
      }));
    }
  };
  
  // Keyboard controls
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
  
  // Game restart on 'R' key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver && (e.key === 'r' || e.key === 'R')) {
        resetGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameOver]);
  
  // Mobile control handlers
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
  
  return {
    gameState,
    gameStarted,
    setGameStarted,
    characterRef,
    platformsRef,
    obstaclesRef,
    coinsRef,
    updateGame,
    resetGame,
    controlHandlers: {
      handleLeftPress,
      handleLeftRelease,
      handleRightPress,
      handleRightRelease,
      handleJumpPress,
      handleJumpRelease
    }
  };
};

export default useGameEngine;
