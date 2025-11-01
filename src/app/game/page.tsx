"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { Creature, CreatureType } from "@/types/game";
import { GAME_CONFIGS, CREATURE_SCORES, CREATURE_PROBABILITIES } from "@/utils/gameConfig";
import GameCanvas from "@/components/GameCanvas";
import GameInfo from "@/components/GameInfo";
import RankingPanel from "@/components/RankingPanel";

export default function GamePage() {
  const router = useRouter();
  const {
    username,
    difficulty,
    score,
    timeLeft,
    isPlaying,
    setScore,
    setTimeLeft,
    startGame,
    endGame,
  } = useGameStore();

  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const config = GAME_CONFIGS[difficulty];

  // 생물 타입 랜덤 선택
  const getRandomCreatureType = (): CreatureType => {
    const rand = Math.random();
    let cumulative = 0;
    for (const item of CREATURE_PROBABILITIES) {
      cumulative += item.probability;
      if (rand <= cumulative) {
        return item.type;
      }
    }
    return "mosquito";
  };

  // 생물 생성
  const spawnCreature = useCallback(() => {
    setCreatures((prev) => {
      if (prev.length >= config.maxCreatures) return prev;

      const type = getRandomCreatureType();
      const speed = Math.random() * (config.speed.max - config.speed.min) + config.speed.min;
      const angle = Math.random() * Math.PI * 2;

      const newCreature: Creature = {
        id: `${Date.now()}-${Math.random()}`,
        type,
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth - 100 : 800) + 50,
        y: Math.random() * (typeof window !== "undefined" ? window.innerHeight - 100 : 600) + 50,
        angle,
        speed,
      };

      return [...prev, newCreature];
    });
  }, [config]);

  // 생물 이동 업데이트
  const updateCreatures = useCallback(() => {
    if (typeof window === "undefined") return;

    const maxX = window.innerWidth - 50;
    const maxY = window.innerHeight - 50;

    setCreatures((prev) =>
      prev.map((creature) => {
        let newAngle = creature.angle;
        let newX = creature.x + Math.cos(creature.angle) * creature.speed;
        let newY = creature.y + Math.sin(creature.angle) * creature.speed;

        // 벽에 부딪히면 반사
        if (newX < 50 || newX > maxX) {
          newAngle = Math.PI - creature.angle;
          newX = Math.max(50, Math.min(maxX, newX));
        }
        if (newY < 50 || newY > maxY) {
          newAngle = -creature.angle;
          newY = Math.max(50, Math.min(maxY, newY));
        }

        // 약간의 방향 변화 추가 (자연스러운 이동)
        if (Math.random() < 0.05) {
          newAngle += (Math.random() - 0.5) * 0.5;
        }

        return {
          ...creature,
          x: newX,
          y: newY,
          angle: newAngle,
        };
      })
    );
  }, []);

  // 생물 클릭 처리
  const handleCreatureClick = useCallback(
    (creatureId: string) => {
      if (!isPlaying) return;

      const creature = creatures.find((c) => c.id === creatureId);
      if (!creature) return;

      const points = CREATURE_SCORES[creature.type] || 0;
      setScore(score + points);
      setCreatures((prev) => prev.filter((c) => c.id !== creatureId));
    },
    [creatures, isPlaying, score, setScore]
  );

  // 게임 시작
  const handleStartGame = () => {
    setGameStarted(true);
    startGame();
    setScore(0);
    setTimeLeft(60);
  };

  // 게임 루프
  useEffect(() => {
    if (!isPlaying) return;

    // 생물 생성 타이머
    spawnIntervalRef.current = setInterval(() => {
      spawnCreature();
    }, config.spawnInterval);

    // 생물 이동 업데이트
    const animate = () => {
      updateCreatures();
      gameLoopRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 시간 감소
    timeIntervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          endGame();
          router.push("/result");
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, [isPlaying, config.spawnInterval, spawnCreature, updateCreatures, setTimeLeft, endGame, router]);

  // 게임 종료 시 정리
  useEffect(() => {
    if (!isPlaying) {
      setCreatures([]);
      setGameStarted(false);
    }
  }, [isPlaying]);

  if (!username) {
    router.push("/");
    return null;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {!gameStarted ? (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">게임 준비</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {difficulty === "easy" ? "쉬움" : difficulty === "medium" ? "보통" : "어려움"} 난이도
            </p>
            <button
              onClick={handleStartGame}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200"
            >
              시작하기
            </button>
          </div>
        </div>
      ) : null}

      <GameCanvas creatures={creatures} onCreatureClick={handleCreatureClick} />

      <div className="absolute top-4 left-4">
        <GameInfo score={score} timeLeft={timeLeft} difficulty={difficulty} />
      </div>

      <div className="absolute top-4 right-4 w-64">
        <RankingPanel difficulty={difficulty} />
      </div>
    </div>
  );
}

