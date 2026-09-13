export const logger = {
  info(message: string, meta?: Record<string, unknown>): void {
    console.info(JSON.stringify({ level: "info", message, ...meta }));
  },
  error(message: string, meta?: Record<string, unknown>): void {
    const safe = { ...meta };
    delete safe.password;
    delete safe.token;
    delete safe.uri;
    console.error(JSON.stringify({ level: "error", message, ...safe }));
  },
};
