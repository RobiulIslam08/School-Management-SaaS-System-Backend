"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
let connecting = null;
async function connectDb() {
    if (!env_1.env.mongoUri) {
        throw new Error("Missing required env: MONGODB_URI");
    }
    if (mongoose_1.default.connection.readyState === 1)
        return;
    if (!connecting) {
        mongoose_1.default.set("strictQuery", true);
        connecting = mongoose_1.default
            .connect(env_1.env.mongoUri, { serverSelectionTimeoutMS: 8000 })
            .then((instance) => {
            logger_1.logger.info("MongoDB connected");
            return instance;
        })
            .catch((error) => {
            connecting = null;
            throw error;
        });
    }
    await connecting;
}
