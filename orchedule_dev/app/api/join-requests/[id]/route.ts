// app/api/join-requests/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import JoinRequest from "@/src/models/joinRequest";
import {Member} from "@/src/models/member";

// ✅ PATCH: 가입 요청 승인
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const { id } = params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ message: "상태값이 필요합니다." }, { status: 400 });
    }

    // ✅ 가입 요청 찾기
    const joinRequest = await JoinRequest.findById(id);
    if (!joinRequest) {
      return NextResponse.json({ message: "가입 요청을 찾을 수 없습니다." }, { status: 404 });
    }

    // ✅ 신규 단원 추가
    const newMember = await Member.create({
      name: joinRequest.name,
      part: joinRequest.part,
      email: joinRequest.email,
    });

    // ✅ 가입 요청 삭제
    await JoinRequest.findByIdAndDelete(id);

    console.log("✅ 가입 요청 승인 완료:", newMember);

    // ✅ 성공적으로 추가된 단원 정보 반환
    return NextResponse.json(newMember, { status: 200 });
  } catch (error) {
    console.error("가입 요청 승인 오류:", error);
    return NextResponse.json({ message: "승인 처리 중 오류 발생" }, { status: 500 });
  }
}

// ✅ DELETE: 가입 요청 거절
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const { id } = params;

    const deletedRequest = await JoinRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return NextResponse.json({ message: "가입 요청을 찾을 수 없습니다." }, { status: 404 });
    }

    console.log("✅ 가입 요청 거절 완료:", deletedRequest);

    return NextResponse.json({ message: "가입 요청이 거절되었습니다." });
  } catch (error) {
    console.error("가입 요청 삭제 오류:", error);
    return NextResponse.json({ message: "삭제 처리 중 오류 발생" }, { status: 500 });
  }
}
