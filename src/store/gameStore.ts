import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Difficulty, GameState } from "@/types/game";

interface GameStore extends GameState {
  setUsername: (username: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setScore: (score: number) => void;
  setTimeLeft: (timeLeft: number) => void;
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
      setScore: (score) => set({ score }),
      setTimeLeft: (timeLeft) => set({ timeLeft }),
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

