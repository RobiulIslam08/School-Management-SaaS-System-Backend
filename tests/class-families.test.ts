import { classFamilies, classFamilyLabel, resolveClassMember } from "../../frontend/src/lib/class-families";

const classes = [
  { _id: "1", name: "Class 8", group: "None", level: 8 },
  { _id: "9s", name: "Class 9 Science", group: "Science", level: 9 },
  { _id: "9b", name: "Class 9 Business", group: "Business", level: 9 },
  { _id: "9h", name: "Class 9 Humanities", group: "Humanities", level: 9 },
];

describe("class families", () => {
  it("strips the group suffix from class labels", () => {
    expect(classFamilyLabel("Class 9 Humanities")).toBe("Class 9");
    expect(classFamilyLabel("Class 5")).toBe("Class 5");
  });

  it("deduplicates Class 9/10 into one family with groups", () => {
    const families = classFamilies(classes);
    const nine = families.find((item) => item.label === "Class 9");
    const eight = families.find((item) => item.label === "Class 8");
    expect(nine?.groups).toEqual(["Science", "Business", "Humanities"]);
    expect(eight?.groups).toEqual([]);
  });

  it("resolves the ClassStructure id from family plus group", () => {
    expect(resolveClassMember(classes, "Class 9", "Humanities")?._id).toBe("9h");
    expect(resolveClassMember(classes, "Class 8", "None")?._id).toBe("1");
  });
});
