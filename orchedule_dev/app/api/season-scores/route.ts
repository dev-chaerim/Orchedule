// app/api/season-scores/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import SeasonScore from "@/src/models/seasonScore";
import type { AttachmentInput } from "@/src/lib/types/sheet";

// GET: 시즌악보 목록 조회 (season query param 지원)
export async function GET(req: NextRequest) {
  await connectDB();

  const seasonId = req.nextUrl.searchParams.get("season");
  const query = seasonId ? { seasonId } : {};

  const scores = await SeasonScore.find(query).sort({ date: -1 });

  return NextResponse.json(scores);
}

// POST: 시즌악보 등록
export async function POST(req: NextRequest) {
  await connectDB();

  const {
    seasonId,
    title,
    author,
    attachments,
    content,
    date,
    parts,
  } = await req.json();

  const formattedAttachments = attachments?.map((file: AttachmentInput) => ({
    url: file.url,
    publicId: file.publicId,
    pageCount: file.pageCount ?? 1,
    type: file.type ?? "image/png",
  })) || [];

  const newScore = new SeasonScore({
    seasonId,
    title,
    author,
    attachments: formattedAttachments,
    content,
    date,
    parts,
    comments: [],
  });

  await newScore.save();

  return NextResponse.json(newScore, { status: 201 });
}
