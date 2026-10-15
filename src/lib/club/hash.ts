import { createHash } from "node:crypto";

/** Hash curto para chaves de rate limit e auditoria: nunca guardar IP ou e-mail em claro. */
export const sha = (v: string) => createHash("sha256").update(v).digest("hex").slice(0, 16);

export const clientIp = (headers: Headers) => (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
