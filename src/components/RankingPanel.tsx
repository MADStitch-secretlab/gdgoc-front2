"use client";

import { useEffect, useState } from "react";
import { Difficulty, RankingEntry } from "@/types/game";

interface RankingPanelProps {
  difficulty: Difficulty;
}

export default function RankingPanel({ difficulty }: RankingPanelProps) {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch(`/api/ranking?difficulty=${difficulty}`);
        if (response.ok) {
          const data = await response.json();
          setRanking(data);
        }
      } catch (error) {
        console.error("랭킹 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
    const interval = setInterval(fetchRanking, 5000); // 5초마다 갱신

    return () => clearInterval(interval);
  }, [difficulty]);

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
        🏆 랭킹 (Top 10)
      </h3>
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          로딩 중...
        </div>
      ) : ranking.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
          아직 랭킹이 없습니다
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {ranking.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-6">
                  {entry.rank}
                </span>
                <span className="text-sm text-gray-800 dark:text-white truncate">
                  {entry.username}
                </span>
              </div>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400 ml-2">
                {entry.score}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

