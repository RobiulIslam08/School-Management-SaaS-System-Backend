"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const donation_service_1 = require("./donation.service");
exports.donationController = {
    async list(req, res) {
        const items = await (0, donation_service_1.listDonations)({
            year: typeof req.query.year === "string" ? req.query.year : undefined,
            month: typeof req.query.month === "string" ? req.query.month : undefined,
            q: typeof req.query.q === "string" ? req.query.q : undefined,
        });
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Donations", items.length));
    },
    async summary(req, res) {
        (0, respond_1.ok)(res, await (0, donation_service_1.donationSummary)({
            year: typeof req.query.year === "string" ? req.query.year : undefined,
            month: typeof req.query.month === "string" ? req.query.month : undefined,
        }), messages_1.msg.loaded("Donation summary"));
    },
    async create(req, res) {
        (0, respond_1.ok)(res, await (0, donation_service_1.createDonation)(req.body, req.user), messages_1.msg.saved("Donation"), 201);
    },
    async update(req, res) {
        (0, respond_1.ok)(res, await (0, donation_service_1.updateDonation)((0, persist_1.routeParam)(req.params.id), req.body), messages_1.msg.updated("Donation"));
    },
    async remove(req, res) {
        (0, respond_1.ok)(res, await (0, donation_service_1.deleteDonation)((0, persist_1.routeParam)(req.params.id)), messages_1.msg.deleted("Donation"));
    },
};
