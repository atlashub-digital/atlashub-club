import { NextResponse } from "next/server";
import type { LiveConfig } from "./mode";

/** Formulários HTML do Club (POST same-origin). Recusa pedidos de outra origem (CSRF). */
export function sameOrigin(req: Request, cfg: LiveConfig) {
  return req.headers.get("origin") === cfg.origin;
}

/** Redireção 303 (POST → GET) para um caminho interno do Club. */
export function seeOther(cfg: LiveConfig, path: string) {
  return NextResponse.redirect(new URL(path, cfg.origin), { status: 303, headers: { "cache-control": "no-store" } });
}
