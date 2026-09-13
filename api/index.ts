import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../src/app";
import { connectDb } from "../src/db/connect";
import { restoreVercelUrl } from "../src/lib/vercel-request";
import { seedOnce } from "../src/seeds";

const app = createApp();

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  restoreVercelUrl(req);
  await connectDb();
  await seedOnce();
  await new Promise<void>((resolve, reject) => {
    const done = () => resolve();
    res.once("finish", done);
    res.once("close", done);
    try {
      const maybe = app(req, res) as void | Promise<void>;
      if (maybe && typeof maybe.then === "function") {
        void maybe.catch(reject);
      }
    } catch (error) {
      reject(error);
    }
  });
}
