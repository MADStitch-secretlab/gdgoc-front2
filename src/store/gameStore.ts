import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Difficulty, GameState } from "@/types/game";

interface GameStore extends GameState {
  setUsername: (username: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setScore: (score: number | ((prev: number) => number)) => void;
  setTimeLeft: (timeLeft: number | ((prev: number) => number)) => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  username: "",
  difficulty: "medium",
  score: 0,
  timeLeft: 60,
  isPlaying: false,
  isGameOver: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUsername: (username) => set({ username }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setScore: (score) =>
        set((state) => ({
          score: typeof score === "function" ? score(state.score) : score,
        })),
      setTimeLeft: (timeLeft) =>
        set((state) => ({
          timeLeft: typeof timeLeft === "function" ? timeLeft(state.timeLeft) : timeLeft,
        })),
      startGame: () => set({ isPlaying: true, isGameOver: false, score: 0, timeLeft: 60 }),
      endGame: () => set({ isPlaying: false, isGameOver: true }),
      resetGame: () => set(initialState),
    }),
    {
      name: "mosquito-game-storage",
      partialize: (state) => ({ username: state.username, difficulty: state.difficulty }),
    }
  )
);

