import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import JoinRequest from "@/src/models/joinRequest";

// ✅ GET: 모든 가입 요청 조회
export async function GET() {
  await connectDB();
  try {
    const joinRequests = await JoinRequest.find({ status: "pending" });
    return NextResponse.json(joinRequests);
  } catch (error) {
      console.log(error)
    return NextResponse.json({ message: "가입 요청 조회 실패" }, { status: 500 });
  }
}

// ✅ POST: 새로운 가입 요청 추가
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { name, part, email } = await req.json();
    if (!name || !part || !email) {
      return NextResponse.json({ message: "모든 필드를 입력해주세요" }, { status: 400 });
    }

    const newRequest = await JoinRequest.create({ name, part, email });
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "가입 요청 추가 실패" }, { status: 500 });
  }
}
