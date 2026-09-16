import { formatStudentAddress } from "../../frontend/src/lib/address";

describe("formatStudentAddress", () => {
  it("joins holding, block and locality in a readable line", () => {
    expect(
      formatStudentAddress({
        holding: "12/A",
        block: "Block C",
        area: "Mirpur",
        district: "Dhaka",
      })
    ).toBe("12/A, Block C, Mirpur, Dhaka");
  });

  it("skips empty parts", () => {
    expect(formatStudentAddress({ division: "Dhaka", holding: "  " })).toBe("Dhaka");
  });
});
