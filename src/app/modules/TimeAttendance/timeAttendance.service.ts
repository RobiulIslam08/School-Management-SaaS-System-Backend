import { DeviceUserMap, TimeAttendanceLog } from "../../../models/TimeAttendance";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

export async function pushPunches(
  deviceId: string,
  punches: Array<{
    deviceUserId: string;
    punchTime: string | Date;
    punchType?: "in" | "out" | "unknown";
    rawData?: Record<string, unknown>;
  }>
) {
  if (!deviceId) throw new ApiError(400, msg.invalid("Time Attendance", "Device ID is required."));
  if (!Array.isArray(punches) || punches.length === 0) {
    return { count: 0 };
  }

  // Pre-load device user mappings
  const mappings = await DeviceUserMap.find({ deviceId });
  const mapByUser = new Map(mappings.map((m) => [m.deviceUserId, m]));

  const docs = punches.map((p) => {
    const pDate = new Date(p.punchTime);
    const dateStr = !Number.isNaN(pDate.getTime()) ? pDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    const map = mapByUser.get(String(p.deviceUserId));

    return {
      deviceId,
      deviceUserId: String(p.deviceUserId),
      punchTime: !Number.isNaN(pDate.getTime()) ? pDate : new Date(),
      punchType: p.punchType ?? "unknown",
      rawData: p.rawData,
      staffId: map?.staffId,
      staffName: map?.staffName ?? "",
      date: dateStr,
    };
  });

  const inserted = await TimeAttendanceLog.insertMany(docs);
  return { count: inserted.length };
}

export async function listTimeLogs(filter: { date?: string; deviceId?: string; staffId?: string }) {
  const query: Record<string, unknown> = {};
  if (filter.date) query.date = filter.date;
  if (filter.deviceId) query.deviceId = filter.deviceId;
  if (filter.staffId) query.staffId = filter.staffId;

  return TimeAttendanceLog.find(query).sort({ punchTime: -1 }).limit(200);
}

export async function listDeviceMappings(deviceId?: string) {
  const query = deviceId ? { deviceId } : {};
  return DeviceUserMap.find(query).sort({ deviceId: 1, deviceUserId: 1 });
}

export async function upsertDeviceMapping(body: {
  deviceId: string;
  deviceUserId: string;
  staffId: string;
  staffName: string;
}) {
  if (!body.deviceId || !body.deviceUserId || !body.staffId) {
    throw new ApiError(400, msg.invalid("Device Mapping", "deviceId, deviceUserId and staffId are required."));
  }

  const updated = await DeviceUserMap.findOneAndUpdate(
    { deviceId: body.deviceId.trim(), deviceUserId: body.deviceUserId.trim() },
    { ...body, deviceId: body.deviceId.trim(), deviceUserId: body.deviceUserId.trim() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return updated;
}

export async function deleteDeviceMapping(id: string | undefined) {
  if (!id) throw new ApiError(400, msg.invalid("Device Mapping", "ID is required."));
  const item = await DeviceUserMap.findByIdAndDelete(id);
  if (!item) throw new ApiError(404, msg.notFound("Device Mapping"));
  return { deleted: true };
}
