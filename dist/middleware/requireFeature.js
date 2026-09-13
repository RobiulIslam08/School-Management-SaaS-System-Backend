"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireFeature = requireFeature;
const features_1 = require("../lib/features");
const FeaturePackage_1 = require("../models/FeaturePackage");
const ApiError_1 = require("../utils/ApiError");
const messages_1 = require("../utils/messages");
function requireFeature(key) {
    return async (req, _res, next) => {
        try {
            if (req.user?.role === "platform_owner") {
                next();
                return;
            }
            const pack = await FeaturePackage_1.FeaturePackage.findOne().lean();
            const enabled = (0, FeaturePackage_1.normalizeModules)(pack?.modules)[key];
            if (!enabled) {
                next(new ApiError_1.ApiError(403, messages_1.msg.featureOff(features_1.FEATURE_LABELS[key])));
                return;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
