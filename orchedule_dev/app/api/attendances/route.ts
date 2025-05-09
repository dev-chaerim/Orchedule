// app/api/attendances/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import Attendance from "@/src/models/attendance";

interface AttendanceRecord {
    memberId: string;
    status: "출석" | "지각" | "불참";
  }

// ✅ GET: 특정 날짜의 출석 데이터 조회
export async function GET(req: NextRequest) {
  await connectDB();
  const date = req.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ message: "날짜를 제공해주세요." }, { status: 400 });
  }

  const found = await Attendance.findOne({ date });

  return NextResponse.json(found || { date, records: [] });
}

// ✅ POST: 새로운 날짜 출석 데이터 등록
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { date, records } = await req.json();
    if (!date || !records || !Array.isArray(records)) {
      return NextResponse.json({ message: "데이터 형식 오류" }, { status: 400 });
    }

    const exists = await Attendance.findOne({ date });
    if (exists) {
      return NextResponse.json({ message: "이미 존재하는 날짜입니다." }, { status: 409 });
    }

    const created = await Attendance.create({ date, records });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("출석 등록 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// ✅ PUT: 기존 날짜 출석 데이터 업데이트
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


  
  export async function PATCH(req: NextRequest) {
    try {
      await connectDB();
      const { date, memberId, status } = await req.json();
  
      const record = await Attendance.findOne({ date });
  
      if (!record) {
        return NextResponse.json({ error: "Record not found" }, { status: 404 });
      }
  
      const target = (record.records as AttendanceRecord[]).find(
        (r) => r.memberId === memberId
      );
  
      if (target) {
        target.status = status;
      } else {
        record.records.push({ memberId, status });
      }
  
      await record.save();
  
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "서버 에러" }, { status: 500 });
    }
  }
  
