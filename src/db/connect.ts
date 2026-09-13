import mongoose from "mongoose";
import { env } from "../config/env";
import { logger } from "../utils/logger";

let connecting: Promise<typeof mongoose> | null = null;

export async function connectDb(): Promise<void> {
  if (!env.mongoUri) {
    throw new Error("Missing required env: MONGODB_URI");
  }
  if (mongoose.connection.readyState === 1) return;
  if (!connecting) {
    mongoose.set("strictQuery", true);
    connecting = mongoose
      .connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 })
      .then((instance) => {
        logger.info("MongoDB connected");
        return instance;
      })
      .catch((error: unknown) => {
        connecting = null;
        throw error;
      });
  }
  await connecting;
}
