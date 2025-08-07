import mongoose from "mongoose";

export async function connectToDB() {
  try {
    const uri = process.env.MONGO_URI;
    console.log("MONGO_URI:", uri);
    if (!uri) {
      throw new Error("MONGO_URI environment variable is not set");
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB via Mongoose");
  } catch (err) {
    console.error("Mongoose connection error:", err.message);
    throw err;
  }
}
