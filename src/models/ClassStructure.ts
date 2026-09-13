import mongoose, { Schema } from "mongoose";

export interface ClassSection {
  name: string;
  capacity: number;
  classTeacherId?: mongoose.Types.ObjectId;
}

export interface ClassStructureDoc {
  name: string;
  code: string;
  level: number;
  sortOrder: number;
  group?: "Science" | "Business" | "Humanities" | "None";
  sections: unknown[];
  isActive: boolean;
}

const classSchema = new Schema<ClassStructureDoc>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    level: { type: Number, required: true },
    sortOrder: { type: Number, default: 0 },
    group: { type: String, enum: ["Science", "Business", "Humanities", "None"], default: "None" },
    sections: { type: [Schema.Types.Mixed], default: [{ name: "A", capacity: 0 }] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "ClassStructures" }
);

classSchema.index({ level: 1 });
classSchema.index({ sortOrder: 1 });

export const ClassStructure = mongoose.model<ClassStructureDoc>("ClassStructure", classSchema);
