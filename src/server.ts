import { env } from "./config/env";
import { createApp } from "./app";
import { connectDb } from "./db/connect";
import { seedIfNeeded } from "./seeds";
import { logger } from "./utils/logger";

async function start(): Promise<void> {
  await connectDb();
  if (env.seedOnBoot) {
    await seedIfNeeded();
  }
  const app = createApp();
  // Bind all interfaces so Dokploy/Docker can reach the process (not only localhost).
  const host = process.env.HOST ?? "0.0.0.0";
  app.listen(env.port, host, () => {
    logger.info(`API listening on ${host}:${env.port}`);
  });
}

start().catch((error: unknown) => {
  logger.error("Failed to start server", { error: error instanceof Error ? error.message : "unknown" });
  process.exit(1);
});
