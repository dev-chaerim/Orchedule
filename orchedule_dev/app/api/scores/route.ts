import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import ScoreCheck from "@/models/scoreCheck";

export const dynamic = "force-dynamic";

// ✅ GET: 목록 조회 (태그나 날짜로 필터링 가능)
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const tag = searchParams.get("tag"); // optional
  const filter: Record<string, unknown> = {};
  if (tag) filter.tags = tag;

  try {
    const scores = await ScoreCheck.find(filter).sort({ date: -1 });
    return NextResponse.json(scores);
  } catch (err) {
    console.error("악보 조회 실패:", err);
    return NextResponse.json({ message: "악보 조회 실패" }, { status: 500 });
  }
}

// ✅ POST: 새 악보 등록
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { title, content, fileUrl, youtubeUrl, tags, author, type } = await req.json();

    // 필수 필드 검증
    if (!title || !fileUrl || !type) {
      return NextResponse.json(
        { message: "제목, 파일 링크, 타입은 필수입니다." },
        { status: 400 }
      );
    }

    const newScore = await ScoreCheck.create({
      title,
      content: content || "",
      fileUrl,
      youtubeUrl,
      tags: tags || [],
      author: author || "익명",
      date: new Date().toISOString(),
      type, // ✅ 추가됨
    });

    return NextResponse.json(newScore, { status: 201 });
  } catch (err) {
    console.error("악보 등록 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
