"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { Difficulty } from "@/types/game";

export default function HomePage() {
  const router = useRouter();
  const { username, difficulty, setUsername, setDifficulty, resetGame } = useGameStore();
  const [localUsername, setLocalUsername] = useState(username);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleStart = () => {
    if (!localUsername.trim()) {
      alert("이름을 입력해주세요!");
      return;
    }
    setUsername(localUsername.trim());
    router.push("/game");
  };

  const difficulties: { value: Difficulty; label: string; description: string }[] = [
    { value: "easy", label: "쉬움", description: "느린 속도, 적은 수" },
    { value: "medium", label: "보통", description: "보통 속도, 보통 수" },
    { value: "hard", label: "어려움", description: "빠른 속도, 많은 수" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            🪰 모기 잡기 게임
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            순발력을 테스트하세요!
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              이름
            </label>
            <input
              id="username"
              type="text"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none"
              onKeyPress={(e) => {
                if (e.key === "Enter") handleStart();
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              난이도 선택
            </label>
            <div className="space-y-2">
              {difficulties.map((diff) => (
                <label
                  key={diff.value}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    difficulty === diff.value
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={diff.value}
                    checked={difficulty === diff.value}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="mr-3 text-purple-500 focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-white">
                      {diff.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {diff.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
            <p className="font-semibold mb-2">게임 규칙:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>🪰 일반 모기: +1점 (70%)</li>
              <li>🦟 말라리아 모기: +3점 (20%)</li>
              <li>🐝 벌: -5점 (10%)</li>
              <li>⏱ 1분 동안 최대한 많은 점수를 획득하세요!</li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            게임 시작
          </button>
        </div>
      </div>
    </div>
  );
}
