import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { liveConfig } from "@/lib/club/mode";
import { memberClient } from "@/lib/club/supabase";
import { paymentsReady } from "@/lib/genesis/checkout";
import { genesisConditions, genesisTermsVersion } from "@/lib/genesis/policy";
import { genesisDeps } from "@/lib/genesis/runtime";
import { genesisFacts, price, priceNotes } from "@/lib/offers";

export const metadata: Metadata = { title: "Matrícula Genesis", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  terms_required: "Para continuar, aceite as condições da matrícula.",
  student_not_approved: "A condição de estudante ainda não foi aprovada. Pode matricular-se no valor padrão ou aguardar a validação.",
  guardian_required: "Menores de 18 anos só avançam com a aprovação do responsável.",
  email_unconfirmed: "Confirme o seu e-mail antes de se matricular.",
  no_profile: "Conclua o cadastro gratuito no Club antes de se matricular.",
  sold_out: "A turma está completa. Fale com a equipe para entrar na lista de espera.",
  already_enrolled: "Você já está matriculado no Genesis Turma 01.",
  sales_closed: "As matrículas ainda não estão abertas.",
  aro_unavailable: "O sistema de pagamento está indisponível. Nada foi cobrado; tente de novo dentro de minutos.",
  price_mismatch: "Não foi possível confirmar o valor. Nada foi cobrado; tente de novo mais tarde.",
  estudante: "Não foi possível registrar o pedido de validação agora.",
};

/** Matrícula paga no Genesis (separada da adesão gratuita ao Club). Só membros com conta. */
export default async function Inscricao({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const cfg = liveConfig();
  const deps = genesisDeps(cfg);
  const open = cfg && paymentsReady(deps) && (await deps.db!.salesOpen().catch(() => false));
  const shell = (body: React.ReactNode) => (
    <section className="ca-section ca-container ca-narrow" aria-labelledby="mat-title">
      <span className="ca-eyebrow">Genesis · Turma 01</span>
      <h1 id="mat-title" className="ca-page-title">Matrícula no Genesis</h1>
      {body}
    </section>
  );
  if (!cfg || !open)
    return shell(
      <p className="ca-notice" role="note">
        <span>
          <strong>As matrículas ainda não estão abertas.</strong> Registre o seu interesse em <Link href="/genesis#early-access">/genesis</Link>; a comunidade do Club continua gratuita.
        </span>
      </p>,
    );

  const supabase = await memberClient(cfg);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/entrar");
  const club = supabase.schema("club");
  const [profile, elig, checkout] = await Promise.all([
    club.from("club_profiles").select("display_name").maybeSingle(),
    club.from("club_student_eligibility").select("status, expires_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    club.from("club_aro_checkouts").select("id, status").in("status", ["pending", "paid"]).maybeSingle(),
  ]);
  if (!profile.data) redirect("/participar");
  if (checkout.data?.status === "paid") return shell(<p className="ca-notice" role="status"><span><strong>Matrícula confirmada.</strong> Bem-vindo à Turma 01, com início previsto em {genesisFacts.start}.</span></p>);
  const studentOk = elig.data?.status === "APPROVED" && new Date(elig.data.expires_at as string) > new Date();
  const studentPending = elig.data?.status === "PENDING";

  return shell(
    <>
      {sp.erro && <p className="ca-notice" role="alert"><span>{errors[sp.erro] ?? "Não foi possível continuar agora."}</span></p>}
      {sp.ok === "estudante" && <p className="ca-notice" role="status"><span>Pedido de validação registrado. A equipe responde pelo e-mail da conta.</span></p>}
      {checkout.data?.status === "pending" && (
        <p className="ca-notice" role="note"><span>Tem um pagamento em curso. <Link href={`/genesis/inscricao/${checkout.data.id}`}>Continuar o pagamento</Link>.</span></p>
      )}
      <div className="ca-card ca-account">
        <h2>Condições</h2>
        <dl>
          {genesisConditions.map((c) => (
            <div key={c.title}><dt>{c.title}</dt><dd>{c.text}</dd></div>
          ))}
        </dl>
      </div>
      <form method="post" action="/api/genesis/checkout" className="ca-card ca-account">
        <h2>Escolha a matrícula</h2>
        <label className="check-inline">
          <input type="radio" name="offer" value="standard" defaultChecked={!studentOk} />
          <span><strong>{price.genesisStandard}</strong> · valor padrão (não exige condição de estudante)</span>
        </label>
        {studentOk && (
          <label className="check-inline">
            <input type="radio" name="offer" value="student" defaultChecked />
            <span><strong>{price.genesisStudent}</strong> · estudante, validação aprovada</span>
          </label>
        )}
        <label className="check-inline">
          <input type="checkbox" name="terms" value={genesisTermsVersion} required />
          <span>Li e aceito as condições da matrícula acima. {priceNotes.noInstallments}</span>
        </label>
        <div className="ca-account__actions">
          <button type="submit" className="ca-btn ca-btn--gold">Matricular e pagar com PIX</button>
        </div>
      </form>
      {!studentOk && (
        <form method="post" action="/api/genesis/student" className="ca-card ca-account">
          <h2>Sou estudante</h2>
          <p>{studentPending ? "O seu pedido está em análise pela equipe." : `Peça a validação para o valor de ${price.genesisStudent}. ${priceNotes.student}`}</p>
          {!studentPending && (
            <>
              <label>Instituição de ensino<input name="institution" maxLength={160} required className="ca-input" /></label>
              <div className="ca-account__actions">
                <button type="submit" className="ca-btn ca-btn--outline">Pedir validação de estudante</button>
              </div>
            </>
          )}
        </form>
      )}
    </>,
  );
}
