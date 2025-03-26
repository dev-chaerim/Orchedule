import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI as string;
if (!MONGO_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

// Extend the global object type properly
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Use a cached connection to prevent multiple connections
const globalWithMongoose = global as typeof global & { mongoose?: MongooseCache };

const cached = globalWithMongoose.mongoose || { conn: null, promise: null };

async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {}).then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  globalWithMongoose.mongoose = cached; // Store connection globally

  return cached.conn;
}

export default connectToDatabase;
