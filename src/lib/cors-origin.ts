export function isAllowedOrigin(requestOrigin: string | undefined, configuredOrigin: string): boolean | string {
  if (!requestOrigin) return true;
  if (!configuredOrigin) return requestOrigin;
  return requestOrigin === configuredOrigin ? requestOrigin : false;
}
