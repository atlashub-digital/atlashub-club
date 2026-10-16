// Acesso do servidor às funções do schema `club` (005). Só service_role.
import type { SupabaseClient } from "@supabase/supabase-js";

export type GenesisOffer = "genesis-01-br" | "genesis-01-student-br";
export type CheckoutRow = { user_id: string; email: string; status: "pending" | "paid" | "released" | "revoked"; offer: GenesisOffer;
  aro_session_id: string | null; aro_order_id: string | null; amount_minor: number | null };

export interface GenesisBackend {
  salesOpen(): Promise<boolean>;
  offerCheck(user: string, offer: GenesisOffer): Promise<string>;
  start(user: string, offer: GenesisOffer, terms: string): Promise<{ id: string; status: string; outcome: "new" | "resume" | "already_paid" }>;
  attach(id: string, session: string, order: string, amount: number, expires: string | null): Promise<void>;
  owner(id: string): Promise<CheckoutRow | null>;
  byOrder(order: string): Promise<string | null>;
  confirm(id: string, order: string): Promise<boolean>;
  release(id: string, reason: string): Promise<void>;
  revoke(order: string, reason: string): Promise<number>;
  recordEvent(id: string, type: string): Promise<boolean>;
  requestStudent(user: string, institution: string): Promise<string>;
}

export function supabaseGenesis(service: SupabaseClient): GenesisBackend {
  const club = service.schema("club");
  const rpc = async <T>(fn: string, args: Record<string, unknown>): Promise<T> => {
    const { data, error } = await club.rpc(fn, args);
    if (error) throw new Error(error.message || error.code || fn);
    return data as T;
  };
  return {
    async salesOpen() {
      const { data, error } = await club.from("club_cohorts").select("sales_open").eq("cohort", "genesis-01").maybeSingle();
      if (error) throw new Error(error.message);
      return data?.sales_open === true;
    },
    offerCheck: (user, offer) => rpc<string>("genesis_offer_check", { p_user: user, p_offer: offer }),
    async start(user, offer, terms) {
      const rows = await rpc<{ id: string; status: string; outcome: "new" | "resume" | "already_paid" }[]>("genesis_start_checkout", { p_user: user, p_offer: offer, p_terms_version: terms });
      return rows[0];
    },
    async attach(id, session, order, amount, expires) { await rpc("genesis_attach_checkout", { p_id: id, p_session: session, p_order: order, p_amount: amount, p_expires: expires }); },
    async owner(id) { const rows = await rpc<CheckoutRow[]>("genesis_checkout_owner", { p_id: id }); return rows[0] ?? null; },
    byOrder: (order) => rpc<string | null>("genesis_checkout_by_order", { p_order: order }),
    confirm: (id, order) => rpc<boolean>("genesis_confirm", { p_id: id, p_order: order }),
    async release(id, reason) { await rpc("genesis_release", { p_id: id, p_reason: reason }); },
    revoke: (order, reason) => rpc<number>("genesis_revoke", { p_order: order, p_reason: reason }),
    recordEvent: (id, type) => rpc<boolean>("aro_record_event", { p_event: id, p_type: type }),
    requestStudent: (user, institution) => rpc<string>("request_student_eligibility", { p_user: user, p_institution: institution }),
  };
}
