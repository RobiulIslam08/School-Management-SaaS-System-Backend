import { Training } from "../../../models/Training";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

export async function listTrainings(status?: string) {
  const query: Record<string, unknown> = status ? { status } : {};
  return Training.find(query).sort({ startDate: -1, createdAt: -1 });
}

export async function createTraining(body: Record<string, unknown>) {
  return Training.create(body);
}

export async function updateTraining(id: string | undefined, body: Record<string, unknown>) {
  if (!id) throw new ApiError(400, msg.invalid("Training", "ID is required."));
  const item = await Training.findById(id);
  if (!item) throw new ApiError(404, msg.notFound("Training"));
  Object.assign(item, body);
  await item.save();
  return item;
}

export async function deleteTraining(id: string | undefined) {
  if (!id) throw new ApiError(400, msg.invalid("Training", "ID is required."));
  const item = await Training.findByIdAndDelete(id);
  if (!item) throw new ApiError(404, msg.notFound("Training"));
  return { deleted: true };
}

export async function updateTrainingAttendance(
  id: string | undefined,
  participants: Array<{ staffId?: string; staffName?: string; attended: boolean; certificateIssued: boolean }>
) {
  if (!id) throw new ApiError(400, msg.invalid("Training", "ID is required."));
  const item = await Training.findById(id);
  if (!item) throw new ApiError(404, msg.notFound("Training"));
  item.participants = participants as any;
  await item.save();
  return item;
}
