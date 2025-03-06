
export type TimerMode = 'focus' | 'break';

export type BreakActivity = 'game' | 'relax' | null;

export interface TimerSettings {
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
}

export interface TimerState {
  mode: TimerMode;
  timeRemaining: number; // in seconds
  isRunning: boolean;
  breakActivity: BreakActivity;
  completed: boolean;
}

export interface CardType {
  id: number;
  matched: boolean;
  flipped: boolean;
  value: number;
}

export interface RelaxStep {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  image?: string;
}
