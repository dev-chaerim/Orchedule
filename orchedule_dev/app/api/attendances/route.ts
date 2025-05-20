// app/api/attendances/route.ts
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
 const all = await Attendance.find();
console.log("📦 전체 출석 데이터:", all);
  const found = await Attendance.findOne({ date, seasonId });
  return NextResponse.json(found || { date, records: [] });
}


export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    console.log("수신 데이터:", body);  // ✅ 데이터 구조 확인 로그

    const { date, seasonId, memberId, status } = body;

    if (!date || !memberId || !status || !seasonId) {
      console.error("데이터 형식 오류: 필수 필드 누락");
      return NextResponse.json({ message: "데이터 형식 오류" }, { status: 400 });
    }

    // ✅ 기존 출석 데이터 확인
    const existingRecord = await Attendance.findOne({ date, seasonId });

    if (existingRecord) {
      // ✅ 기존 기록 수정 또는 추가
      const recordIndex = existingRecord.records.findIndex(
        (record: AttendanceRecord) => record.memberId === memberId
      );

      if (recordIndex >= 0) {
        existingRecord.records[recordIndex].status = status;
      } else {
        existingRecord.records.push({ memberId, status });
      }

      await existingRecord.save();
      return NextResponse.json({ message: "출석 상태가 업데이트되었습니다." }, { status: 200 });
    }

    // ✅ 새로운 출석 데이터 저장
    await Attendance.create({
      date: format(date, "yyyy-MM-dd"),
      seasonId,
      records: [{ memberId, status }],
    });

    const after = await Attendance.findOne({ date });
    console.log("📌 저장 후 출석:", after);

    return NextResponse.json({ message: "출석 상태가 저장되었습니다." }, { status: 201 });
  } catch (err) {
    console.error("출석 등록 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}



// ✅ PUT: 기존 날짜 출석 데이터 전체 업데이트
export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const { date, records } = await req.json();
    if (!date || !records || !Array.isArray(records)) {
      return NextResponse.json({ message: "데이터 형식 오류" }, { status: 400 });
    }

    const updated = await Attendance.findOneAndUpdate(
      { date },
      { records },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    console.error("출석 수정 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
