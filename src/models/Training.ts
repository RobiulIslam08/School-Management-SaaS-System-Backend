import mongoose, { Schema } from "mongoose";

const participantSchema = new Schema(
  {
    staffId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    staffName: { type: String, default: "" },
    attended: { type: Boolean, default: false },
    certificateIssued: { type: Boolean, default: false },
  },
  { _id: false }
);

export interface TrainingDoc {
  title: string;
  description?: string;
  trainer?: string;
  venue?: string;
  startDate?: Date;
  endDate?: Date;
  targetRoles: string[];
  participants: Array<{
    staffId?: mongoose.Types.ObjectId;
    staffName?: string;
    attended: boolean;
    certificateIssued: boolean;
  }>;
  status: "upcoming" | "ongoing" | "completed";
}

const trainingSchema = new Schema<TrainingDoc>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    trainer: { type: String, default: "" },
    venue: { type: String, default: "" },
    startDate: { type: Date },
    endDate: { type: Date },
    targetRoles: { type: [String], default: ["teacher"] },
    participants: { type: [participantSchema], default: [] },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

trainingSchema.index({ startDate: 1, status: 1 });

export const Training = mongoose.model<TrainingDoc>("Training", trainingSchema);
