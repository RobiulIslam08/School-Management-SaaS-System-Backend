import { TransportRoute } from "../../../models/Operations";
import { deleteDocument, updateDocument } from "../../../utils/persist";

export async function listRoutes() {
  return TransportRoute.find().sort({ name: 1 });
}

export async function createRoute(body: Record<string, unknown>) {
  return TransportRoute.create(body);
}

export async function updateRoute(id: string | undefined, body: unknown) {
  return updateDocument(TransportRoute, id, body, "Transport route");
}

export async function deleteRoute(id: string | undefined) {
  return deleteDocument(TransportRoute, id, "Transport route");
}
