export function isAllowedOrigin(requestOrigin: string | undefined, configuredOrigin: string | readonly string[]): boolean | string {
  if (!requestOrigin) return true;
  const list = (Array.isArray(configuredOrigin) ? configuredOrigin : [configuredOrigin])
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
  if (!list.length) return requestOrigin;
  return list.includes(requestOrigin) ? requestOrigin : false;
}
