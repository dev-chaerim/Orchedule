// app/api/score-checks/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import ScoreCheck from "@/src/models/scoreCheck";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const seasonId = searchParams.get("season");

  const query = seasonId ? { seasonId } : {};

  const scoreChecks = await ScoreCheck.find(query).sort({ date: -1 });

  return NextResponse.json(scoreChecks);
}

export async function POST(req: NextRequest) {
  await connectDB();

  const data = await req.json();

  const newScoreCheck = new ScoreCheck(data);

  await newScoreCheck.save();

  return NextResponse.json(newScoreCheck, { status: 201 });
}
