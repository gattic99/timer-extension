import { GameCharacter, Platform, Obstacle, Coin, GameState } from "@/types/gameTypes";
import { toast } from "sonner";

// Check for platform collisions
export const checkPlatformCollisions = (
  character: GameCharacter,
  platforms: Platform[],
  cameraOffsetX: number
): boolean => {
  let onPlatform = false;
  
  for (const platform of platforms) {
    // Only check platforms that are near the character horizontally
    const platformLeftEdge = platform.x - cameraOffsetX;
    const platformRightEdge = platformLeftEdge + platform.width;
    const characterLeftEdge = character.x;
    const characterRightEdge = character.x + character.width;
    
    if (
      characterRightEdge > platformLeftEdge &&
      characterLeftEdge < platformRightEdge &&
      character.y + character.height >= platform.y &&
      character.y + character.height <= platform.y + platform.height / 2 &&
      character.velocityY > 0
    ) {
      character.y = platform.y - character.height;
      character.velocityY = 0;
      character.isJumping = false;
      onPlatform = true;
      break;
    }
  }
  
  return onPlatform;
};

// Check for obstacle collisions
export const checkObstacleCollisions = (
  character: GameCharacter,
  obstacles: Obstacle[],
  cameraOffsetX: number
): boolean => {
  for (const obstacle of obstacles) {
    const obstacleLeftEdge = obstacle.x - cameraOffsetX;
    const obstacleRightEdge = obstacleLeftEdge + obstacle.width;
    const characterLeftEdge = character.x;
    const characterRightEdge = character.x + character.width;
    
    if (
      characterRightEdge > obstacleLeftEdge &&
      characterLeftEdge < obstacleRightEdge &&
      character.y + character.height > obstacle.y &&
      character.y < obstacle.y + obstacle.height
    ) {
      // Hit obstacle
      toast.error("You hit an office obstacle! Game Over!");
      return true;
    }
  }
  
  return false;
};

// Check if character fell off the bottom of the screen
export const checkFallOffScreen = (character: GameCharacter): boolean => {
  // If character falls below 500, they've fallen off the screen and should die
  if (character.y > 500) {
    toast.error("You fell off the office floor! Game Over!");
    return true;
  }
  return false;
};

// Check for coin collection and return score delta
export const checkCoinCollection = (
  character: GameCharacter,
  coins: Coin[],
  cameraOffsetX: number
): number => {
  let scoreIncrease = 0;
  
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    if (coin.collected) continue;
    
    const coinLeftEdge = coin.x - cameraOffsetX;
    const coinRightEdge = coinLeftEdge + coin.width;
    const characterLeftEdge = character.x;
    const characterRightEdge = character.x + character.width;
    
    if (
      characterRightEdge > coinLeftEdge &&
      characterLeftEdge < coinRightEdge &&
      character.y + character.height > coin.y &&
      character.y < coin.y + coin.height
    ) {
      coins[i].collected = true;
      let points = 10; // Default points
      
      if (coin.type === 'coffee') {
        points = 10;
      } else if (coin.type === 'document') {
        points = 20; // Documents worth more
      } else if (coin.type === 'point') {
        points = 15; // Points for new collectible
      }
      
      scoreIncrease += points;
      toast.success(`+${points} points!`);
    }
  }
  
  return scoreIncrease;
};

// Update character movement
export const updateCharacterMovement = (
  character: GameCharacter,
  keys: { left: boolean; right: boolean; up: boolean },
  canvasWidth: number,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  // Handle character movement
  if (keys.left) character.velocityX = -5;
  else if (keys.right) character.velocityX = 5;
  else character.velocityX = 0;
  
  if (keys.up && !character.isJumping) {
    character.velocityY = -12;
    character.isJumping = true;
  }
  
  // Apply gravity - no need to adjust this as it's fine
  character.velocityY += 0.5;
  
  // Cap the maximum falling speed to prevent the "falling too fast and dying" issue
  // This ensures the character doesn't fall too quickly and "clip through" platforms
  if (character.velocityY > 12) {
    character.velocityY = 12;
  }

  // Update character position based on velocity
  // Moving horizontally - fixed to always make forward progress
  if (character.velocityX > 0) {
    // Character is trying to move right
    setGameState(prev => {
      // Always update worldPosition when moving right
      const newWorldPosition = prev.worldPosition + character.velocityX;
      const newCameraOffsetX = prev.cameraOffsetX + character.velocityX;
      
      return {
        ...prev,
        worldPosition: newWorldPosition,
        cameraOffsetX: newCameraOffsetX
      };
    });
    
    // Keep character visually centered
    character.x = Math.min(canvasWidth / 2, character.x);
  } else if (character.velocityX < 0) {
    // Moving left
    if (gameState.worldPosition > 0) {
      // Don't allow going back past the start
      const moveAmount = Math.min(Math.abs(character.velocityX), gameState.worldPosition);
      
      setGameState(prev => ({
        ...prev,
        worldPosition: prev.worldPosition - moveAmount,
        cameraOffsetX: prev.cameraOffsetX - moveAmount
      }));
    } else {
      // At the start of the level, allow movement left until edge
      character.x += character.velocityX;
      if (character.x < 0) character.x = 0;
    }
  }
  
  // Apply vertical movement
  character.y += character.velocityY;
};
