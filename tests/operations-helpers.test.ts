import { canDeleteHostel, canSetOccupied, occupancyPct } from "../src/app/modules/Hostel/hostel.utils";
import { availableAfterCopyChange, canDeleteBook, canReduceCopies, issuedCount } from "../src/app/modules/Library/library.utils";

describe("library stock helpers", () => {
  it("keeps issued copies when stock changes", () => {
    expect(issuedCount(10, 7)).toBe(3);
    expect(availableAfterCopyChange(12, 3)).toBe(9);
    expect(canReduceCopies(3, 3)).toBe(true);
    expect(canReduceCopies(2, 3)).toBe(false);
    expect(canDeleteBook(0)).toBe(true);
    expect(canDeleteBook(1)).toBe(false);
  });
});

describe("hostel occupancy helpers", () => {
  it("rejects over-capacity and occupied deletes", () => {
    expect(occupancyPct(10, 40)).toBe(25);
    expect(occupancyPct(1, 0)).toBe(0);
    expect(canSetOccupied(40, 40)).toBe(true);
    expect(canSetOccupied(41, 40)).toBe(false);
    expect(canDeleteHostel(0)).toBe(true);
    expect(canDeleteHostel(2)).toBe(false);
  });
});
