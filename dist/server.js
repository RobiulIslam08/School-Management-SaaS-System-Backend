"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const app_1 = require("./app");
const connect_1 = require("./db/connect");
const seeds_1 = require("./seeds");
const logger_1 = require("./utils/logger");
async function start() {
    await (0, connect_1.connectDb)();
    if (env_1.env.seedOnBoot) {
        await (0, seeds_1.seedIfNeeded)();
    }
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.port, () => {
        logger_1.logger.info(`API listening on ${env_1.env.port}`);
    });
}
start().catch((error) => {
    logger_1.logger.error("Failed to start server", { error: error instanceof Error ? error.message : "unknown" });
    process.exit(1);
});
