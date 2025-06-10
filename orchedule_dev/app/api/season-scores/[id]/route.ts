import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongoose';
import SeasonScore from '@/src/models/seasonScore';
import mongoose from 'mongoose';
import type { Comment } from '@/src/lib/types/sheet';

export const dynamic = 'force-dynamic';

// ✅ GET: 시즌악보 상세 조회
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  try {
    const score = await SeasonScore.findById(id);
    if (!score) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(score);
  } catch (err) {
    console.error('시즌악보 상세 조회 실패:', err);
    return NextResponse.json({ message: '시즌악보 상세 조회 실패' }, { status: 500 });
  }
}

// ✅ PATCH: 시즌악보 수정 + 댓글 기능 추가
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  try {
    const body = await req.json();
    const score = await SeasonScore.findById(id);
    if (!score) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    // ✅ 댓글 추가
    if (body.action === 'addComment') {
      const newComment = {
        _id: new mongoose.Types.ObjectId(),
        authorId: body.authorId,
        authorName: body.authorName,
        content: body.content,
        createdAt: new Date(),
      };

      score.comments.push(newComment);
      await score.save();

      return NextResponse.json(newComment, { status: 201 });
    }

    // ✅ 댓글 삭제
    if (body.action === 'deleteComment') {
      const commentId = body.commentId;

      score.comments = score.comments.filter(
        (comment: Comment) => comment._id.toString() !== commentId
        );

      await score.save();

      return NextResponse.json({ success: true }, { status: 200 });
    }

    // ✅ 기존 시즌악보 수정 (title, content 등)
    const { title, content, attachments, parts, author, date } = body;

    score.title = title;
    score.content = content;
    score.attachments = attachments;
    score.parts = parts;
    score.author = author;
    score.date = date;

    await score.save();

    return NextResponse.json(score);
  } catch (err) {
    console.error('시즌악보 수정 실패:', err);
    return NextResponse.json({ message: '시즌악보 수정 실패' }, { status: 500 });
  }
}

// ✅ DELETE: 시즌악보 삭제
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  try {
    const deleted = await SeasonScore.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('시즌악보 삭제 실패:', err);
    return NextResponse.json({ message: '시즌악보 삭제 실패' }, { status: 500 });
  }
}
