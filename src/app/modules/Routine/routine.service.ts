import { Routine } from "../../../models/Routine";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId } from "../../../utils/persist";
import type { RoutineSlotBody } from "./routine.interface";

export async function listRoutine(classId?: string, section?: string) {
  const filter: Record<string, unknown> = {};
  if (classId) filter.classId = classId;
  if (section) filter.section = section;
  return Routine.find(filter)
    .populate("subjectId", "name code")
    .populate("teacherId", "name staffId")
    .sort({ day: 1, period: 1 });
}

export async function upsertSlot(body: RoutineSlotBody) {
  return Routine.findOneAndUpdate(
    { classId: body.classId, section: body.section, day: body.day, period: body.period },
    {
      $set: {
        subjectId: body.subjectId || undefined,
        teacherId: body.teacherId || undefined,
      },
    },
    { upsert: true, new: true }
  );
}

export async function deleteSlot(id: string | undefined) {
  const recordId = requireId(id, "Routine");
  const item = await Routine.findByIdAndDelete(recordId);
  if (!item) throw new ApiError(404, msg.notFound("Routine"));
  return { deleted: true };
}
