
export interface GameCharacter {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'desk' | 'floor' | 'shelf';
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'chair' | 'trash' | 'printer' | 'computer' | 'paperclip';
}

export interface Coin {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  type: 'coffee' | 'document' | 'point';
}

export interface GameState {
  score: number;
  cameraOffsetX: number;
  worldPosition: number;
  gameOver: boolean;
}

export interface GameKeys {
  left: boolean;
  right: boolean;
  up: boolean;
}
