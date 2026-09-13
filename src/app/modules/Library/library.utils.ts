export function issuedCount(copies: number, available: number): number {
  return Math.max(0, copies - available);
}

export function availableAfterCopyChange(copies: number, issued: number): number {
  return copies - issued;
}

export function canReduceCopies(copies: number, issued: number): boolean {
  return copies >= issued;
}

export function canDeleteBook(openIssues: number): boolean {
  return openIssues === 0;
}
