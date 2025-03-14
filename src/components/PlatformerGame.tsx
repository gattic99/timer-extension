import React, { useEffect, useRef } from "react";
import { formatTime } from "@/utils/timerUtils";
import { TimerState } from "@/types";
import GameControls from "./GameControls";
import useGameEngine from "@/hooks/useGameEngine";
import { drawBackground, drawPlatforms, drawObstacles, drawCollectibles, drawCharacter, drawUI, drawGameOver } from "@/utils/gameRenderUtils";
import { initialCharacter, initialPlatforms, initialObstacles, initialCoins } from "@/data/gameData";
import { toast } from "sonner";
import { getExtensionURL } from "@/utils/chromeUtils";

interface PlatformerGameProps {
  onReturn: () => void;
  timerState: TimerState;
  onStart?: () => void;
  onPause?: () => void;
}

const PlatformerGame: React.FC<PlatformerGameProps> = ({
  onReturn,
  timerState,
  onStart,
  onPause
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const {
    gameState,
    gameStarted,
    setGameStarted,
    characterRef,
    platformsRef,
    obstaclesRef,
    coinsRef,
    updateGame,
    resetGame,
    controlHandlers
  } = useGameEngine({
    initialCharacter,
    initialPlatforms,
    initialObstacles,
    initialCoins
  });

  useEffect(() => {
    try {
      audioRef.current = new Audio(getExtensionURL('/assets/office-ambience.mp3'));
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current.play().catch(error => {
        console.error("Audio playback error:", error);
        toast.error("Background audio couldn't be played. Try interacting with the page first.");
      });
      console.log("Background audio loaded successfully");
      audioRef.current.addEventListener('canplay', () => {
        console.log("Audio can play now");
      });
      audioRef.current.addEventListener('error', e => {
        console.error("Audio error:", e);
      });
    } catch (error) {
      console.error("Audio initialization error:", error);
    }
    return () => {
      if (audioRef.current) {
        console.log("Cleaning up audio");
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setGameStarted(true);
    resetGame();
    if (onStart && !timerState.isRunning) {
      onStart();
    }
    return () => {
      if (onPause && timerState.isRunning) {
        onPause();
      }
    };
  }, []);

  useEffect(() => {
    if (!gameStarted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const gameLoop = setInterval(() => {
      if (!gameState.gameOver) {
        updateGame();
      }
      renderGame(ctx);
    }, 16);
    return () => {
      clearInterval(gameLoop);
    };
  }, [gameStarted, gameState.gameOver, updateGame]);

  const renderGame = (ctx: CanvasRenderingContext2D) => {
    drawBackground(ctx, gameState.cameraOffsetX);
    drawPlatforms(ctx, platformsRef.current, gameState.cameraOffsetX);
    drawObstacles(ctx, obstaclesRef.current, gameState.cameraOffsetX);
    drawCollectibles(ctx, coinsRef.current, gameState.cameraOffsetX);
    drawCharacter(ctx, characterRef.current);
    drawUI(ctx, gameState, timerState.timeRemaining, timerState.mode);
    if (gameState.gameOver) {
      drawGameOver(ctx, gameState.score);
    }
  };

  const handleReturn = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onReturn();
  };

  const handleUserInteraction = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => {
        console.error("Failed to play audio after interaction:", err);
      });
    }
  };

  return (
    <div className="fixed inset-0 top-auto bottom-0 w-full h-screen bg-blue-100 z-[10000] flex flex-col items-center" onClick={handleUserInteraction}>
      <div className="text-center mt-4 mb-2">
        <h2 className="text-xl font-bold text-focus-purple">Office Escape 🏃🏼‍♂️‍➡️🏃🏼‍♀️‍➡️</h2>
        <p className="text-muted-foreground text-sm font-semibold py-[8px] text-center max-w-4xl w-full mx-auto px-4">Dodge obstacles and collect coins—they're your colleagues, Sina and Cristina! Everything except coins and trees will take you out! You can also jump on the shelves—they are not obstacles! The more coins you collect, the higher your score!</p>
      </div>
      
      <div className="relative w-full max-w-4xl mx-auto">
        <canvas ref={canvasRef} width={700} height={400} className="bg-white border border-gray-200 rounded-lg shadow-md mx-auto" />
        
        <GameControls onLeftPress={controlHandlers.handleLeftPress} onLeftRelease={controlHandlers.handleLeftRelease} onRightPress={controlHandlers.handleRightPress} onRightRelease={controlHandlers.handleRightRelease} onJumpPress={controlHandlers.handleJumpPress} onJumpRelease={controlHandlers.handleJumpRelease} />
      </div>
      
      <div className="flex justify-center mt-4 mb-6">
        {gameState.gameOver ? <button onClick={resetGame} className="bg-focus-purple text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors mr-4">
            Play Again
          </button> : null}
        <button onClick={handleReturn} className="bg-white text-focus-purple border border-focus-purple px-6 py-2 rounded-full hover:bg-focus-purple hover:text-white transition-colors">
          Return to Timer
        </button>
      </div>
    </div>
  );
};

export default PlatformerGame;
