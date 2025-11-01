import { Difficulty, GameConfig } from "@/types/game";

export const GAME_CONFIGS: Record<Difficulty, GameConfig> = {
  easy: {
    speed: { min: 2, max: 3 },
    spawnInterval: 1000,
    maxCreatures: 5,
  },
  medium: {
    speed: { min: 4, max: 5 },
    spawnInterval: 700,
    maxCreatures: 7,
  },
  hard: {
    speed: { min: 6, max: 8 },
    spawnInterval: 500,
    maxCreatures: 10,
  },
};

export const CREATURE_SCORES: Record<string, number> = {
  mosquito: 1,
  malaria: 3,
  bee: -5,
};

export const CREATURE_PROBABILITIES = [
  { type: "mosquito" as const, probability: 0.7 },
  { type: "malaria" as const, probability: 0.2 },
  { type: "bee" as const, probability: 0.1 },
];

