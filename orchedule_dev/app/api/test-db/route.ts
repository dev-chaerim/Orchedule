// app/api/test-db/route.ts
import { connectDB } from "@/src/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "✅ Connected to MongoDB!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "❌ Database connection failed" }, { status: 500 });
  }
}
