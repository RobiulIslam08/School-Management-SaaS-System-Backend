export async function nextStaffId(count: number): Promise<string> {
  return `TCH-${String(count + 1).padStart(4, "0")}`;
}
