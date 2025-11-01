export type Difficulty = "easy" | "medium" | "hard";

export type CreatureType = "mosquito" | "malaria" | "bee";

export interface Creature {
  id: string;
  type: CreatureType;
  x: number;
  y: number;
  angle: number;
  speed: number;
}

export interface GameState {
  username: string;
  difficulty: Difficulty;
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  isGameOver: boolean;
}

export interface RankingEntry {
  rank: number;
  username: string;
  score: number;
  timestamp?: number;
}

export interface GameConfig {
  speed: { min: number; max: number };
  spawnInterval: number;
  maxCreatures: number;
}

