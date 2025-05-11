import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { Member } from "@/src/models/member";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { name, part } = await req.json();
    const { id } = await params;

    const updatedMember = await Member.findByIdAndUpdate(id, { name, part }, { new: true });
    if (!updatedMember) {
      return NextResponse.json({ message: "멤버를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("멤버 수정 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedMember = await Member.findByIdAndDelete(id);
    if (!deletedMember) {
      return NextResponse.json({ message: "멤버를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ message: "멤버 삭제 완료" });
  } catch (error) {
    console.error("멤버 삭제 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

