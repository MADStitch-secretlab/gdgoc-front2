import { NextRequest, NextResponse } from "next/server";
import { Difficulty, RankingEntry } from "@/types/game";

// 인메모리 저장소 (실제로는 DB를 사용해야 하지만 MVP 단계에서는 메모리 사용)
const rankings: Record<Difficulty, Array<{ username: string; score: number; timestamp: number }>> = {
  easy: [],
  medium: [],
  hard: [],
};

// GET: 랭킹 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const difficulty = searchParams.get("difficulty") as Difficulty;

  if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
  }

  const ranking = rankings[difficulty]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((entry, index) => ({
      rank: index + 1,
      username: entry.username,
      score: entry.score,
      timestamp: entry.timestamp,
    }));

  return NextResponse.json(ranking);
}

// POST: 점수 제출
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, difficulty, score } = body;

    if (!username || !difficulty || typeof score !== "number") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
    }

    // 점수 추가
    rankings[difficulty].push({
      username,
      score,
      timestamp: Date.now(),
    });

    // 최고 점수만 유지하고 정렬 (최대 100개까지 저장)
    rankings[difficulty] = rankings[difficulty]
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    // 업데이트된 랭킹 반환
    const ranking: RankingEntry[] = rankings[difficulty]
      .slice(0, 10)
      .map((entry, index) => ({
        rank: index + 1,
        username: entry.username,
        score: entry.score,
        timestamp: entry.timestamp,
      }));

    return NextResponse.json({ status: "saved", ranking });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

