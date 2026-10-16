import { aroConfig } from "../aro/client";
import type { LiveConfig } from "../club/mode";
import { serviceClient } from "../club/supabase";
import { supabaseGenesis } from "./backend";
import type { GenesisDeps } from "./checkout";

/** Dependências reais (servidor). Sem modo live do Club não há base: matrícula fechada. */
export function genesisDeps(cfg: LiveConfig | null): GenesisDeps {
  return { aro: aroConfig(), db: cfg ? supabaseGenesis(serviceClient(cfg)) : null, env: process.env, fetch, now: () => new Date() };
}
export const genesisSecretCookie = (id: string) => `club_gco_${id.replace(/-/g, "")}`;
