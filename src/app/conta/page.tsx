import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { liveConfig } from "@/lib/club/mode";
import { memberClient } from "@/lib/club/supabase";
import { statusLabels } from "@/lib/adesao/status";
import { earlyAccess, genesisFacts, price, priceNotes } from "@/lib/offers";

export const metadata: Metadata = { title: "A minha conta", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  "ok:consentimento": "Preferência de e-mail atualizada.",
  "ok:pedido": "Pedido registado. A equipe responde pelo e-mail da conta.",
  "erro:consentimento": "Não foi possível atualizar a preferência agora. Tente de novo.",
  "erro:pedido": "Não foi possível registar o pedido agora. Tente de novo.",
  "ok:genesis": "Interesse no Genesis registrado. Nenhum pagamento foi pedido; a equipe entra em contato antes da abertura.",
  "erro:genesis": "Não foi possível registrar o interesse no Genesis agora. Tente de novo.",
  "erro:perfil": "O seu e-mail foi confirmado, mas não conseguimos concluir o perfil agora. Tente entrar de novo mais tarde.",
};

const genesisLabels: Record<string, string> = {
  interested: statusLabels.genesis_interest,
  student_pending: statusLabels.student_pending,
  withdrawn: "Pré-candidatura retirada",
};

/** Conta real do membro (modo live). Todas as leituras usam a sessão do membro e passam pelas RLS. */
export default async function Conta({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const cfg = liveConfig();
  if (!cfg) {
    return (
      <section className="ca-section ca-container ca-narrow" aria-labelledby="conta-title">
        <h1 id="conta-title" className="ca-page-title">
          A minha conta
        </h1>
        <p className="ca-notice" role="note">
          <span>
            <strong>As contas do Club ainda não estão ativas.</strong> Veja a <Link href="/area-membro">prévia da área de membro</Link>.
          </span>
        </p>
      </section>
    );
  }

  const supabase = await memberClient(cfg);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/entrar");

  const club = supabase.schema("club");
  const [profile, intent, genesis, consent] = await Promise.all([
    club.from("club_profiles").select("display_name, created_at").maybeSingle(),
    club.from("club_signup_intents").select("plan").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    club.from("club_genesis_applications").select("status").maybeSingle(),
    club.from("my_marketing_consent").select("granted").maybeSingle(),
  ]);
  const name = profile.data?.display_name as string | undefined;
  const marketing = consent.data?.granted === true;
  const notice = Object.entries(sp).map(([k, v]) => notices[`${k}:${v}`]).find(Boolean);

  return (
    <section className="ca-section ca-container ca-narrow" aria-labelledby="conta-title">
      <span className="ca-eyebrow">Conta do Club</span>
      <h1 id="conta-title" className="ca-page-title">
        {sp["bem-vindo"] && name ? `Boas-vindas ao Club, ${name}!` : name ? `Olá, ${name}` : "A minha conta"}
      </h1>
      {notice && (
        <p className="ca-notice" role="status">
          <span>{notice}</span>
        </p>
      )}
      {!name ? (
        <p className="ca-notice" role="note">
          <span>
            O seu e-mail está confirmado, mas ainda não há perfil do Club associado a ele. Para entrar no Club,{" "}
            <Link href="/participar">faça o cadastro gratuito</Link>; se acabou de o fazer e o problema continuar, fale com a equipe.
          </span>
        </p>
      ) : (
        <div className="ca-card ca-account">
          <dl>
            <dt>E-mail</dt>
            <dd>{auth.user.email}</dd>
            <dt>Percurso</dt>
            <dd>{intent.data?.plan === "genesis" ? "Club Atlas gratuito + interesse no Genesis" : "Club Atlas · gratuito"}</dd>
            {genesis.data?.status && (
              <>
                <dt>Genesis</dt>
                <dd>{genesisLabels[genesis.data.status as string] ?? "Em análise pela equipe"} · nenhum pagamento foi pedido</dd>
              </>
            )}
            <dt>Novidades por e-mail</dt>
            <dd>{marketing ? "Ativadas" : "Desativadas"}</dd>
          </dl>
          <div className="ca-account__actions">
            <form method="post" action="/api/club/consent">
              <input type="hidden" name="marketing" value={marketing ? "off" : "on"} />
              <button type="submit" className="ca-btn ca-btn--outline">
                {marketing ? "Deixar de receber novidades" : "Quero receber novidades"}
              </button>
            </form>
          </div>
        </div>
      )}
      {name && (!genesis.data?.status || genesis.data.status === "withdrawn") && (
        <div className="ca-card ca-account">
          <h2>Genesis · Turma 01</h2>
          <p>
            Programa opcional de {genesisFacts.weeks} semanas e {genesisFacts.ateliers} ateliers, com início previsto em {genesisFacts.start}.{" "}
            {earlyAccess.summary}
          </p>
          <p>{earlyAccess.fine}</p>
          <form method="post" action="/api/club/genesis-interest" className="ca-account__actions">
            <label className="check-inline">
              <input type="checkbox" name="student" />
              <span>
                Sou estudante e quero pedir a condição de {price.genesisStudent} (padrão {price.genesisStandard}). {priceNotes.student}
              </span>
            </label>
            <button type="submit" className="ca-btn ca-btn--gold">
              Registrar interesse no Genesis
            </button>
          </form>
        </div>
      )}
      <div className="ca-card ca-account">
        <h2>{name ? "Os seus dados" : "Sessão"}</h2>
        {name && (
          <p>
            Pode pedir uma cópia dos seus dados do Club ou o apagamento deles. Consulte o <Link href="/privacidade">aviso de privacidade</Link>.
          </p>
        )}
        <div className="ca-account__actions">
          {name && (
            <>
              <form method="post" action="/api/club/data-request">
                <input type="hidden" name="kind" value="access" />
                <button type="submit" className="ca-btn ca-btn--outline">
                  Pedir cópia dos dados
                </button>
              </form>
              <form method="post" action="/api/club/data-request">
                <input type="hidden" name="kind" value="delete" />
                <button type="submit" className="ca-btn ca-btn--outline">
                  Pedir apagamento dos dados do Club
                </button>
              </form>
            </>
          )}
          <form method="post" action="/api/club/logout">
            <button type="submit" className="ca-btn ca-btn--ghost">
              Sair
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
