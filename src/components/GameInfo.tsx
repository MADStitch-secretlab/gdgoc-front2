"use client";

import { Difficulty } from "@/types/game";

interface GameInfoProps {
  score: number;
  timeLeft: number;
  difficulty: Difficulty;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export default function GameInfo({ score, timeLeft, difficulty }: GameInfoProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-4 space-y-2 min-w-[200px]">
      <div className="flex items-center justify-between">
        <span className="text-gray-600 dark:text-gray-400 text-sm">점수</span>
        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {score}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600 dark:text-gray-400 text-sm">남은 시간</span>
        <span className={`text-xl font-bold ${timeLeft <= 10 ? "text-red-500" : "text-gray-800 dark:text-white"}`}>
          {timeDisplay}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600 dark:text-gray-400 text-sm">난이도</span>
        <span className="text-sm font-semibold text-gray-800 dark:text-white">
          {DIFFICULTY_LABELS[difficulty]}
        </span>
      </div>
    </div>
  );
}

