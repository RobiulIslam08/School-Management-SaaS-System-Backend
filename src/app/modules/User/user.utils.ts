export function stripSecrets<T extends { passwordHash?: string; totpSecret?: string }>(user: T): Omit<T, "passwordHash" | "totpSecret"> {
  const { passwordHash: _p, totpSecret: _t, ...safe } = user;
  return safe;
}
