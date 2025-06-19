// app/api/score-checks/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import ScoreCheck from "@/src/models/scoreCheck";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const seasonId = searchParams.get("seasonId");

  const query = seasonId ? { seasonId } : {}; // ← 필터링 적용

  try {
    const scores = await ScoreCheck.find(query).sort({ date: -1 });
    return NextResponse.json(scores);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "악보 조회 실패" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  const data = await req.json();

  const newScoreCheck = new ScoreCheck(data);

  await newScoreCheck.save();

  return NextResponse.json(newScoreCheck, { status: 201 });
}
