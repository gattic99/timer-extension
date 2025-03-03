
import React, { useState, useEffect } from "react";
import { generateCards } from "@/utils/timerUtils";
import { CardType } from "@/types";
import { Sparkles } from "lucide-react";

interface MemoryGameProps {
  onReturn: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onReturn }) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  
  // Number of pairs in the game
  const totalPairs = 6;
  
  // Initialize the game
  useEffect(() => {
    const initialCards = generateCards(totalPairs).map(card => ({
      ...card,
      matched: false,
      flipped: false
    }));
    
    setCards(initialCards);
    setFlippedIndexes([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameCompleted(false);
  }, []);
  
  // Handle card flipping
  const handleCardClick = (index: number) => {
    // Ignore if already two cards are flipped or this card is already flipped/matched
    if (
      flippedIndexes.length === 2 ||
      cards[index].flipped ||
      cards[index].matched
    ) {
      return;
    }
    
    // Flip the card
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    
    // Add to flipped cards
    const newFlippedIndexes = [...flippedIndexes, index];
    setFlippedIndexes(newFlippedIndexes);
    
    // If two cards are flipped, check for match
    if (newFlippedIndexes.length === 2) {
      setMoves(moves + 1);
      
      const [firstIndex, secondIndex] = newFlippedIndexes;
      
      if (cards[firstIndex].value === cards[secondIndex].value) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].matched = true;
          matchedCards[secondIndex].matched = true;
          setCards(matchedCards);
          setFlippedIndexes([]);
          setMatchedPairs(matchedPairs + 1);
          
          // Check if all pairs are matched
          if (matchedPairs + 1 === totalPairs) {
            setGameCompleted(true);
          }
        }, 500);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].flipped = false;
          resetCards[secondIndex].flipped = false;
          setCards(resetCards);
          setFlippedIndexes([]);
        }, 1000);
      }
    }
  };
  
  // Reset the game
  const resetGame = () => {
    const initialCards = generateCards(totalPairs).map(card => ({
      ...card,
      matched: false,
      flipped: false
    }));
    
    setCards(initialCards);
    setFlippedIndexes([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameCompleted(false);
  };

  return (
    <div className="game-card p-8 w-full max-w-xl mx-auto animate-scale-in">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Sparkles className="text-game-orange mr-2" size={24} />
          <h2 className="text-2xl font-bold text-dark-text">Memory Game</h2>
        </div>
        <p className="text-muted-foreground mb-2">
          Match pairs of cards in as few moves as possible.
        </p>
        <div className="flex justify-center space-x-8 text-sm mb-6">
          <div className="flex flex-col items-center">
            <span className="font-semibold text-dark-text">Pairs</span>
            <span>{matchedPairs}/{totalPairs}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-dark-text">Moves</span>
            <span>{moves}</span>
          </div>
        </div>
      </div>
      
      {gameCompleted ? (
        <div className="text-center py-6 animate-fade-in">
          <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
          <p className="mb-6">You completed the game in {moves} moves.</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={resetGame} 
              className="btn-game"
            >
              Play Again
            </button>
            <button 
              onClick={onReturn} 
              className="btn-secondary"
            >
              Return to Timer
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {cards.map((card, index) => (
              <div 
                key={card.id} 
                className={`
                  w-full aspect-square rounded-lg cursor-pointer transition-all duration-300
                  ${card.flipped || card.matched 
                    ? 'bg-game-orange shadow-md rotate-y-180' 
                    : 'bg-white shadow-sm hover:shadow-md'}
                  ${card.matched ? 'opacity-80' : 'opacity-100'}
                `}
                onClick={() => handleCardClick(index)}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {(card.flipped || card.matched) && (
                    <span className="text-3xl font-bold text-white select-none">
                      {card.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={onReturn} 
              className="btn-secondary"
            >
              Return to Timer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MemoryGame;
