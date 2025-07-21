
import { TimerSettings } from "@/types";

// Convert minutes to seconds
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

// Format seconds to MM:SS display
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Get percentage of time remaining for progress display
export const getTimePercentage = (
  timeRemaining: number,
  totalDuration: number
): number => {
  return (timeRemaining / totalDuration) * 100;
};

// Default timer settings
export const defaultTimerSettings: TimerSettings = {
  focusDuration: 25, // 25 minutes for focus time
  breakDuration: 5, // 5 minutes for break time
};

// Generate shuffled pairs for memory game
export const generateCards = (pairs: number): { id: number, value: number }[] => {
  // Create array with pairs of values
  const values = Array.from({ length: pairs }, (_, i) => i + 1);
  const cards = [...values, ...values]; // Duplicate to create pairs
  
  // Shuffle the array using Fisher-Yates algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  
  // Map to objects with ids
  return cards.map((value, index) => ({
    id: index,
    value
  }));
};

// Get stretching and relaxation steps
export const getRelaxationSteps = (): Array<{ title: string; description: string }> => {
  return [
    {
      title: "Deep Breathing",
      description: "Sit comfortably with your back straight. Breathe in deeply through your nose for 4 seconds, hold for 2 seconds, then exhale slowly through your mouth for 6 seconds. Repeat 5 times."
    },
    {
      title: "Neck Stretch",
      description: "Gently tilt your head toward your right shoulder until you feel a stretch. Hold for 15-30 seconds, then repeat on the left side."
    },
    {
      title: "Shoulder Rolls",
      description: "Roll your shoulders forward in a circular motion 5 times, then backward 5 times to release tension in your shoulders and upper back."
    },
    {
      title: "Wrist and Finger Stretch",
      description: "Extend your arm with palm facing down, then gently pull fingers back with your other hand. Hold for 15-30 seconds, then switch hands."
    },
    {
      title: "Eye Rest",
      description: "Look away from your screen, focus on an object at least 20 feet away for 20 seconds. This helps reduce eye strain from digital screens."
    }
  ];
};
