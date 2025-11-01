"use client";

import { useRef } from "react";
import { Creature } from "@/types/game";

interface GameCanvasProps {
  creatures: Creature[];
  onCreatureClick: (creatureId: string) => void;
}

const CREATURE_EMOJIS: Record<string, string> = {
  mosquito: "🪰",
  malaria: "🦟",
  bee: "🐝",
};

const CREATURE_COLORS: Record<string, string> = {
  mosquito: "text-gray-800",
  malaria: "text-red-600",
  bee: "text-yellow-600",
};

export default function GameCanvas({ creatures, onCreatureClick }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 클릭 위치에서 가장 가까운 생물 찾기 (50px 반경)
    const clickedCreature = creatures.find((creature) => {
      const distance = Math.sqrt(
        Math.pow(clickX - creature.x, 2) + Math.pow(clickY - creature.y, 2)
      );
      return distance < 50;
    });

    if (clickedCreature) {
      onCreatureClick(clickedCreature.id);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-crosshair"
      onClick={handleClick}
    >
      {creatures.map((creature) => (
        <div
          key={creature.id}
          className={`absolute text-4xl select-none pointer-events-none transition-transform hover:scale-110 ${
            CREATURE_COLORS[creature.type]
          }`}
          style={{
            left: `${creature.x}px`,
            top: `${creature.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {CREATURE_EMOJIS[creature.type]}
        </div>
      ))}
    </div>
  );
}

