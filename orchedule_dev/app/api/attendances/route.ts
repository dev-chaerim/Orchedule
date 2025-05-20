import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import Attendance from "@/src/models/attendance";
import { format } from "date-fns";

interface AttendanceRecord {
  memberId: string;
  status: "출석" | "지각" | "불참";
}

// ✅ GET: 특정 날짜와 시즌의 출석 데이터 조회
export async function GET(req: NextRequest) {
  await connectDB();

  const date = req.nextUrl.searchParams.get("date");
  const seasonId = req.nextUrl.searchParams.get("seasonId");

  if (!date || !seasonId) {
    return NextResponse.json({ message: "날짜 또는 시즌 ID를 제공해주세요." }, { status: 400 });
  }

  const found = await Attendance.findOne({ date, seasonId });
  return NextResponse.json(found || { date, records: [] });
}

// ✅ POST: 새로운 출석 데이터 생성 또는 한 명 추가
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { date, seasonId, memberId, status } = body;

    if (!date || !seasonId || !memberId || !status) {
      return NextResponse.json({ message: "데이터 형식 오류" }, { status: 400 });
    }

    const existingRecord = await Attendance.findOne({ date, seasonId });

    if (existingRecord) {
      const recordIndex = existingRecord.records.findIndex((r: AttendanceRecord) => r.memberId === memberId);
      if (recordIndex >= 0) {
        existingRecord.records[recordIndex].status = status;
      } else {
        existingRecord.records.push({ memberId, status });
      }
      await existingRecord.save();
      return NextResponse.json({ message: "출석 상태가 업데이트되었습니다." }, { status: 200 });
    }

    await Attendance.create({
      date: format(new Date(date), "yyyy-MM-dd"),
      seasonId,
      records: [{ memberId, status }],
    });

    return NextResponse.json({ message: "출석 상태가 저장되었습니다." }, { status: 201 });
  } catch (err) {
    console.error("출석 등록 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// ✅ PATCH: 특정 단원의 출석 상태만 수정
export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const { date, seasonId, memberId, status } = await req.json();

    if (!date || !seasonId || !memberId || !status) {
      return NextResponse.json({ message: "데이터 형식 오류" }, { status: 400 });
    }

    const record = await Attendance.findOne({ date, seasonId });
    if (!record) {
      return NextResponse.json({ message: "출석 데이터가 없습니다." }, { status: 404 });
    }

    const target = record.records.find((r: AttendanceRecord) => r.memberId === memberId);
    if (target) {
      target.status = status;
    } else {
      record.records.push({ memberId, status });
    }

    await record.save();
    return NextResponse.json({ message: "출석 상태가 수정되었습니다." });
  } catch (err) {
    console.error("출석 상태 수정 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// ✅ PUT: 전체 records 덮어쓰기 (일괄 수정용)
export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const { date, seasonId, records } = await req.json();

    if (!date || !seasonId || !records || !Array.isArray(records)) {
      return NextResponse.json({ message: "데이터 형식 오류" }, { status: 400 });
    }

    const updated = await Attendance.findOneAndUpdate(
      { date, seasonId },
      { records },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    console.error("출석 수정 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
