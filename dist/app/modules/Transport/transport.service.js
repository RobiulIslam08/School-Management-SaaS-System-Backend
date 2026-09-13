"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRoutes = listRoutes;
exports.createRoute = createRoute;
exports.updateRoute = updateRoute;
exports.deleteRoute = deleteRoute;
const Operations_1 = require("../../../models/Operations");
const persist_1 = require("../../../utils/persist");
async function listRoutes() {
    return Operations_1.TransportRoute.find().sort({ name: 1 });
}
async function createRoute(body) {
    return Operations_1.TransportRoute.create(body);
}
async function updateRoute(id, body) {
    return (0, persist_1.updateDocument)(Operations_1.TransportRoute, id, body, "Transport route");
}
async function deleteRoute(id) {
    return (0, persist_1.deleteDocument)(Operations_1.TransportRoute, id, "Transport route");
}
