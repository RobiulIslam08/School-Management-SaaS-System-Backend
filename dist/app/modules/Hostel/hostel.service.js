"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listHostels = listHostels;
exports.createHostel = createHostel;
exports.updateHostel = updateHostel;
exports.deleteHostel = deleteHostel;
const Operations_1 = require("../../../models/Operations");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const hostel_utils_1 = require("./hostel.utils");
async function listHostels() {
    return Operations_1.Hostel.find().sort({ name: 1 });
}
async function createHostel(body) {
    return Operations_1.Hostel.create(body);
}
async function updateHostel(id, body) {
    const recordId = (0, persist_1.requireId)(id, "Hostel");
    const payload = (0, persist_1.requirePayload)(body, "Hostel");
    const item = await Operations_1.Hostel.findById(recordId);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Hostel"));
    const nextCapacity = typeof payload.capacity === "number" ? payload.capacity : item.capacity;
    const nextOccupied = typeof payload.occupied === "number" ? payload.occupied : item.occupied;
    if (!(0, hostel_utils_1.canSetOccupied)(nextOccupied, nextCapacity)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.updateBlocked("Hostel", "Occupied beds cannot exceed capacity."));
    }
    return (0, persist_1.updateDocument)(Operations_1.Hostel, id, payload, "Hostel");
}
async function deleteHostel(id) {
    const recordId = (0, persist_1.requireId)(id, "Hostel");
    const item = await Operations_1.Hostel.findById(recordId);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Hostel"));
    if (!(0, hostel_utils_1.canDeleteHostel)(item.occupied)) {
        throw new ApiError_1.ApiError(409, messages_1.msg.updateBlocked("Hostel", "Move residents out before deleting this hostel."));
    }
    return (0, persist_1.deleteDocument)(Operations_1.Hostel, id, "Hostel");
}
