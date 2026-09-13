import { ClassStructure } from "../../../models/ClassStructure";
import { Subject } from "../../../models/Subject";
import { updateDocument } from "../../../utils/persist";

export async function listClasses() {
  return ClassStructure.find().sort({ level: 1, name: 1 });
}

export async function createClass(body: Record<string, unknown>) {
  return ClassStructure.create(body);
}

export async function updateClass(id: string | undefined, body: unknown) {
  return updateDocument(ClassStructure, id, body, "Class");
}

export async function listSubjects(classId?: string) {
  return Subject.find(classId ? { classId } : {}).populate("classId", "name code").sort({ name: 1 });
}

export async function createSubject(body: Record<string, unknown>) {
  return Subject.create(body);
}

export async function updateSubject(id: string | undefined, body: unknown) {
  return updateDocument(Subject, id, body, "Subject");
}
