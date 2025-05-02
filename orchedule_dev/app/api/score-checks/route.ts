// app/api/score-checks/route.ts
import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/src/lib/mongoose";
import Score from "@/src/models/score";

export async function GET() {
  await connectDB();

  const scoreChecks = await Score.find({ type: "bowing" }).sort({ date: -1 });
  return NextResponse.json(scoreChecks);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  if (!body.title || !body.author || !body.fileUrl || !body.parts) {
    return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
  }

  const newScore = await Score.create({
    ...body,
    type: "bowing",
    isNewScore: true, // ← 초기 등록 시 true
  });

  return NextResponse.json(newScore, { status: 201 });
}
