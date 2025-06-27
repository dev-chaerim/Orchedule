import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import JoinRequest from "@/src/models/joinRequest";
import Member from "@/src/models/member"; // ✅ 추가

export async function GET(req: NextRequest) {
  await connectDB();

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ message: "이메일이 필요합니다." }, { status: 400 });
  }

  const joinRequestExists = await JoinRequest.findOne({ email });
  const memberExists = await Member.findOne({ email }); 

  const exists = !!joinRequestExists || !!memberExists;

  return NextResponse.json({ exists });
}
