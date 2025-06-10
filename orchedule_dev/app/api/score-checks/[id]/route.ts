// app/api/score-checks/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import ScoreCheck from "@/src/models/scoreCheck";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;

  const scoreCheck = await ScoreCheck.findById(id).exec();

  if (!scoreCheck) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(scoreCheck);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;

  const data = await req.json();

  const updated = await ScoreCheck.findByIdAndUpdate(id, data, { new: true }).exec();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;

  const deleted = await ScoreCheck.findByIdAndDelete(id).exec();

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
