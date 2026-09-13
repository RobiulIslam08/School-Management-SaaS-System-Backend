import { Hostel } from "../../../models/Operations";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { deleteDocument, requireId, requirePayload, updateDocument } from "../../../utils/persist";
import { canDeleteHostel, canSetOccupied } from "./hostel.utils";

export async function listHostels() {
  return Hostel.find().sort({ name: 1 });
}

export async function createHostel(body: Record<string, unknown>) {
  return Hostel.create(body);
}

export async function updateHostel(id: string | undefined, body: unknown) {
  const recordId = requireId(id, "Hostel");
  const payload = requirePayload(body, "Hostel");
  const item = await Hostel.findById(recordId);
  if (!item) throw new ApiError(404, msg.notFound("Hostel"));
  const nextCapacity = typeof payload.capacity === "number" ? payload.capacity : item.capacity;
  const nextOccupied = typeof payload.occupied === "number" ? payload.occupied : item.occupied;
  if (!canSetOccupied(nextOccupied, nextCapacity)) {
    throw new ApiError(400, msg.updateBlocked("Hostel", "Occupied beds cannot exceed capacity."));
  }
  return updateDocument(Hostel, id, payload, "Hostel");
}

export async function deleteHostel(id: string | undefined) {
  const recordId = requireId(id, "Hostel");
  const item = await Hostel.findById(recordId);
  if (!item) throw new ApiError(404, msg.notFoundRead("Hostel"));
  if (!canDeleteHostel(item.occupied)) {
    throw new ApiError(409, msg.updateBlocked("Hostel", "Move residents out before deleting this hostel."));
  }
  return deleteDocument(Hostel, id, "Hostel");
}
