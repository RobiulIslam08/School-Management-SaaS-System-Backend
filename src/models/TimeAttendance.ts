import mongoose, { Schema } from "mongoose";

export interface TimeAttendanceLogDoc {
  deviceId: string;
  deviceUserId: string; // user ID on the device
  punchTime: Date;
  punchType: "in" | "out" | "unknown";
  rawData?: Record<string, unknown>;
  // Resolved after sync
  staffId?: mongoose.Types.ObjectId;
  staffName?: string;
  date?: string; // YYYY-MM-DD for easy filtering
}

const timeAttendanceLogSchema = new Schema<TimeAttendanceLogDoc>(
  {
    deviceId: { type: String, required: true },
    deviceUserId: { type: String, required: true },
    punchTime: { type: Date, required: true },
    punchType: { type: String, enum: ["in", "out", "unknown"], default: "unknown" },
    rawData: { type: Schema.Types.Mixed },
    staffId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    staffName: { type: String },
    date: { type: String }, // YYYY-MM-DD
  },
  { timestamps: true }
);

timeAttendanceLogSchema.index({ deviceId: 1, punchTime: -1 });
timeAttendanceLogSchema.index({ date: 1, staffId: 1 });
timeAttendanceLogSchema.index({ deviceId: 1, deviceUserId: 1, date: 1 });

export const TimeAttendanceLog = mongoose.model<TimeAttendanceLogDoc>(
  "TimeAttendanceLog",
  timeAttendanceLogSchema
);

// Device user mapping
export interface DeviceUserMapDoc {
  deviceId: string;
  deviceUserId: string;
  staffId: mongoose.Types.ObjectId;
  staffName: string;
}

const deviceUserMapSchema = new Schema<DeviceUserMapDoc>(
  {
    deviceId: { type: String, required: true },
    deviceUserId: { type: String, required: true },
    staffId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    staffName: { type: String, required: true },
  },
  { timestamps: true }
);

deviceUserMapSchema.index({ deviceId: 1, deviceUserId: 1 }, { unique: true });

export const DeviceUserMap = mongoose.model<DeviceUserMapDoc>("DeviceUserMap", deviceUserMapSchema);
