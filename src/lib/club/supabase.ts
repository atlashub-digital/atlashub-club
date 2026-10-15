import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { LiveConfig } from "./mode";

/**
 * Clientes Supabase do Club — SÓ servidor. O browser nunca recebe chaves Supabase:
 * a sessão do membro vive em cookies httpOnly geridos por @supabase/ssr.
 */
const noPersist = { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } as const;

/** service_role: escreve no schema `club` através das funções 003 e cria revisões de responsável. */
export function serviceClient(cfg: LiveConfig): SupabaseClient {
  return createClient(cfg.supabaseUrl, cfg.serviceKey, { auth: noPersist });
}

/** Cliente anónimo sem sessão, só para pedir links de confirmação por e-mail. */
export function anonClient(cfg: LiveConfig): SupabaseClient {
  return createClient(cfg.supabaseUrl, cfg.anonKey, { auth: { ...noPersist, flowType: "implicit" } });
}

/** Cliente com a sessão do membro (cookies). As leituras passam pelas políticas RLS do schema `club`. */
export async function memberClient(cfg: LiveConfig): Promise<SupabaseClient> {
  const store = await cookies();
  return createServerClient(cfg.supabaseUrl, cfg.anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server Component: não pode escrever cookies; o middleware renova a sessão.
        }
      },
    },
  });
}
