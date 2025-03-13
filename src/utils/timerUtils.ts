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
