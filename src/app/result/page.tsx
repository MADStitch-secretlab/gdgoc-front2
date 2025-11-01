"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { Difficulty, RankingEntry } from "@/types/game";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export default function ResultPage() {
  const router = useRouter();
  const { username, difficulty, score, setScore, resetGame } = useGameStore();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!username || score === 0) {
      router.push("/");
      return;
    }

    const submitScoreAndFetchRanking = async () => {
      try {
        setSubmitting(true);
        // 점수 제출
        await fetch("/api/ranking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            difficulty,
            score,
          }),
        });

        // 랭킹 조회
        const response = await fetch(`/api/ranking?difficulty=${difficulty}`);
        if (response.ok) {
          const data = await response.json();
          setRanking(data);
        }
      } catch (error) {
        console.error("점수 제출 또는 랭킹 조회 실패:", error);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    };

    submitScoreAndFetchRanking();
  }, [username, difficulty, score, router]);

  const handlePlayAgain = () => {
    setScore(0);
    router.push("/game");
  };

  const handleGoHome = () => {
    resetGame();
    router.push("/");
  };

  const userRank = ranking.findIndex((entry) => entry.username === username) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            게임 종료! 🎉
          </h1>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">플레이어: {username}</p>
            <p className="text-gray-600 dark:text-gray-300">
              난이도: {DIFFICULTY_LABELS[difficulty]}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-center">
          <p className="text-white/90 text-sm mb-2">최종 점수</p>
          <p className="text-6xl font-bold text-white">{score}</p>
          {userRank > 0 && userRank <= 10 && (
            <p className="text-white/90 mt-2 text-lg">
              🏆 {userRank}위에 랭크되었습니다!
            </p>
          )}
        </div>

        {submitting || loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            점수를 저장하고 랭킹을 불러오는 중...
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {DIFFICULTY_LABELS[difficulty]} 난이도 랭킹 (Top 10)
            </h2>
            {ranking.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                아직 랭킹이 없습니다
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                {ranking.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded ${
                      entry.username === username
                        ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500"
                        : "hover:bg-gray-100 dark:hover:bg-gray-600"
                    } transition-colors`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span
                        className={`text-lg font-bold w-8 ${
                          entry.rank <= 3
                            ? "text-yellow-500"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {entry.rank <= 3 && "🥇🥈🥉"[entry.rank - 1]}
                        {entry.rank > 3 && `#${entry.rank}`}
                      </span>
                      <span
                        className={`text-base ${
                          entry.username === username
                            ? "font-bold text-purple-600 dark:text-purple-400"
                            : "text-gray-800 dark:text-white"
                        }`}
                      >
                        {entry.username}
                      </span>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        entry.username === username
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-gray-800 dark:text-white"
                      }`}
                    >
                      {entry.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            onClick={handlePlayAgain}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200"
          >
            다시 하기
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}

