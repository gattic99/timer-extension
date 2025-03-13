
/**
 * Format time in seconds to MM:SS display format
 */
export const formatTime = (seconds: number = 0): string => {
  if (typeof seconds !== 'number' || isNaN(seconds)) {
    console.error('Invalid seconds value for formatTime:', seconds);
    seconds = 0;
  }
  
  // Ensure seconds is a non-negative integer
  seconds = Math.max(0, Math.floor(seconds));
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Convert minutes to seconds
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

/**
 * Default timer settings
 */
export const defaultTimerSettings = {
  focusDuration: 25, // in minutes
  breakDuration: 5 // in minutes
};

/**
 * Generate cards for the memory game
 */
export const generateCards = (numPairs: number): { id: number; value: number }[] => {
  // Create an array with pairs of numbers
  const values = Array.from({ length: numPairs }, (_, i) => i + 1);
  const pairs = [...values, ...values];
  
  // Shuffle the pairs
  const shuffled = pairs
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }, index) => ({ id: index, value }));
  
  return shuffled;
};

/**
 * Get relaxation steps for the break mode
 */
export const getRelaxationSteps = (): Array<{
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  image?: string;
}> => {
  return [
    {
      id: 1,
      title: "Deep Breathing",
      description: "Take 5 deep breaths. Inhale through your nose for 4 counts, hold for 2, then exhale through your mouth for 6 counts.",
      shortDescription: "Inhale through your nose (4 counts), hold (2 counts), exhale through mouth (6 counts). Repeat 5 times.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400"
    },
    {
      id: 2,
      title: "Neck Stretch",
      description: "Gently tilt your head to the right, bringing your ear toward your shoulder. Hold for 15-30 seconds, then repeat on the left side.",
      shortDescription: "Tilt head to right bringing ear toward shoulder. Hold 15-30 seconds. Repeat on left side.",
      image: "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?auto=format&fit=crop&w=400"
    },
    {
      id: 3,
      title: "Shoulder Rolls",
      description: "Roll your shoulders backward in a circular motion 5 times, then forward 5 times.",
      shortDescription: "Roll shoulders backward 5 times, then forward 5 times to release tension.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400"
    },
    {
      id: 4,
      title: "Eye Rest",
      description: "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.",
      shortDescription: "Look at something 20 feet away for 20 seconds to reduce digital eye strain.",
      image: "https://images.unsplash.com/photo-1494869042583-f6c911f04b4c?auto=format&fit=crop&w=400"
    },
    {
      id: 5,
      title: "Wrist Stretches",
      description: "Extend your arm with palm up, then use your other hand to gently pull fingers back toward your body. Hold for 15-30 seconds, then switch hands.",
      shortDescription: "Extend arm with palm up, pull fingers back with other hand. Hold 15-30 seconds per side.",
      image: "https://images.unsplash.com/photo-1519834089823-af79b1420f6f?auto=format&fit=crop&w=400"
    },
    {
      id: 6,
      title: "Mindful Minute",
      description: "Close your eyes and focus solely on your breathing for one minute. Notice the sensation of air moving in and out of your body.",
      shortDescription: "Close eyes, focus on breathing for one minute. Notice the sensations of each breath.",
      image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400"
    }
  ];
};
