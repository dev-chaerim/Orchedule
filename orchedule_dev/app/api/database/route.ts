import connectToDatabase from "@/lib/mongodb";
export async function GET() {
  try {
    await connectToDatabase();
    return Response.json({ message: "Connected to MongoDB!" });
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Database connection failed" }, { status: 500 });
  }
}