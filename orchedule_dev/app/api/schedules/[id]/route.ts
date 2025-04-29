import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { Schedule } from '@/models/Schedule';

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  await connectDB();

  const schedule = await Schedule.findById(params.id);
  if (!schedule) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  return NextResponse.json(schedule);
}

export async function PATCH(req: Request, { params }: Params) {
  await connectDB();

  const updateData = await req.json();
  const updated = await Schedule.findByIdAndUpdate(params.id, updateData, { new: true });

  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  await connectDB();

  const deleted = await Schedule.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  return NextResponse.json({ message: 'Deleted successfully' });
}
