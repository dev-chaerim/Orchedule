import {connectDB} from "@/src/lib/mongoose";
export async function GET() {
  try {
    await connectDB();
    return Response.json({ message: "Connected to MongoDB!" });
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Database connection failed" }, { status: 500 });
  }
}