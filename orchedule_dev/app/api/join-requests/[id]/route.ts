import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import JoinRequest from "@/src/models/joinRequest";

// ✅ PATCH: 가입 요청 승인
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const { id } = params;
    const updatedRequest = await JoinRequest.findByIdAndUpdate(id, { status: "approved" }, { new: true });
    if (!updatedRequest) {
      return NextResponse.json({ message: "가입 요청을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "가입 요청 승인 실패" }, { status: 500 });
  }
}

// ✅ DELETE: 가입 요청 거절
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const { id } = params;
    const deletedRequest = await JoinRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return NextResponse.json({ message: "가입 요청을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ message: "가입 요청이 거절되었습니다." });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "가입 요청 삭제 실패" }, { status: 500 });
  }
}
