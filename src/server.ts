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
  app.listen(env.port, () => {
    logger.info(`API listening on ${env.port}`);
  });
}

start().catch((error: unknown) => {
  logger.error("Failed to start server", { error: error instanceof Error ? error.message : "unknown" });
  process.exit(1);
});
