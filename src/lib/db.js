import { MongoClient } from "mongodb";

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        "MONGODB_URI is not set. Add it to studiospace_front_end/.env or to " +
          "your hosting provider's environment variables, then restart or redeploy."
      );
    }

    const client = new MongoClient(uri);
    await client.connect();

    await client.db().command({ ping: 1 });

    console.log("MongoDB Connected Successfully!");

    return client;
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    throw error;
  }
}
