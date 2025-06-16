import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import Member from "@/src/models/member";
import SeatAssignment from "@/src/models/seatAssignment";

// ✅ 단원 정보 수정
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { name, part } = await req.json();
    const { id } = params;

    // ✅ 유효성 검사
    if (!name || !part) {
      return NextResponse.json(
        { message: "이름과 파트를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // ✅ 기존 멤버 정보 가져오기
    const existingMember = await Member.findById(id);
    if (!existingMember) {
      return NextResponse.json(
        { message: "멤버를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const partChanged = existingMember.part !== part;

    // ✅ 멤버 정보 업데이트
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { name, part },
      { new: true }
    );

    // ✅ 파트가 바뀌었다면 좌석 정보 삭제
    if (partChanged) {
      await SeatAssignment.deleteOne({ memberId: id });
    }

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("[PATCH /api/members/:id] 멤버 수정 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// ✅ 단원 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const deletedMember = await Member.findByIdAndDelete(id);
    if (!deletedMember) {
      return NextResponse.json(
        { message: "멤버를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "멤버 삭제 완료", deletedId: id });
  } catch (error) {
    console.error("[DELETE /api/members/:id] 멤버 삭제 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
