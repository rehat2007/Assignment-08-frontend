import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectDB() {
  try {
    await client.connect();

    await client.db().command({ ping: 1 });

    console.log("MongoDB Connected Successfully!");

    return client;
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    throw error;
  }
}