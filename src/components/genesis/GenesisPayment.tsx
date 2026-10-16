"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type View =
  | { state: "PENDING"; offer: string; amountMinor: number | null; payment: { copyPaste: string; qrSvg: string; expiresAt: string } | null }
  | { state: "PROCESSING" | "ENROLLED" | "FAILED" | "EXPIRED" | "CANCELED" | "RELEASED" | "REVOKED" };

const brl = (m: number) => "R$ " + (m / 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 });

export default function GenesisPayment({ id }: { id: string }) {
  const [v, setV] = useState<View | null>(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const r = await fetch(`/api/genesis/checkout/${id}`, { cache: "no-store", credentials: "same-origin" });
        if (r.status === 401) { window.location.assign("/entrar"); return; }
        if (r.status === 404) { setErr("Matrícula não encontrada."); return; }
        const d = (await r.json()) as View;
        if (!alive) return;
        setV(d); setErr("");
        if (d.state === "PENDING" || d.state === "PROCESSING") t.current = setTimeout(poll, 4000);
      } catch {
        if (alive) { setErr("Sem conexão; tentando de novo…"); t.current = setTimeout(poll, 8000); }
      }
    };
    poll();
    return () => { alive = false; if (t.current) clearTimeout(t.current); };
  }, [id]);

  if (!v) return <p role="status">{err || "Carregando o pagamento…"}</p>;
  if (v.state === "ENROLLED")
    return <div className="ca-card ca-account" role="status"><h2>Matrícula confirmada.</h2><p>Pagamento aprovado e acesso ativo. Os detalhes da Turma 01 chegam pelo e-mail da conta.</p><Link className="ca-btn ca-btn--outline" href="/conta">Ir para a conta</Link></div>;
  if (v.state === "PROCESSING")
    return <div className="ca-card ca-account" role="status"><h2>Pagamento recebido.</h2><p>Confirmando a matrícula… Esta página atualiza sozinha.</p></div>;
  if (v.state !== "PENDING")
    return <div className="ca-card ca-account" role="status"><h2>{v.state === "REVOKED" ? "Matrícula cancelada." : "O pagamento não foi concluído."}</h2><p>{v.state === "REVOKED" ? "O pagamento foi reembolsado ou estornado." : "Nada foi cobrado por esta tentativa."}</p><Link className="ca-btn ca-btn--gold" href="/genesis/inscricao">Voltar à matrícula</Link></div>;
  return (
    <div className="ca-card ca-account">
      <h2>Pagamento PIX {v.amountMinor ? `· ${brl(v.amountMinor)}` : ""}</h2>
      {v.payment ? (
        <>
          <div role="img" aria-label="QR Code PIX" style={{ background: "#fff", borderRadius: 12, padding: 12, maxWidth: 260 }} dangerouslySetInnerHTML={{ __html: v.payment.qrSvg }} />
          <p>Válido até {new Date(v.payment.expiresAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}.</p>
          <label>PIX Copia e Cola<input readOnly value={v.payment.copyPaste} className="ca-input" onFocus={(e) => e.currentTarget.select()} /></label>
          <div className="ca-account__actions">
            <button type="button" className="ca-btn ca-btn--gold" onClick={() => navigator.clipboard.writeText(v.payment!.copyPaste).then(() => setCopied(true))}>{copied ? "Copiado" : "Copiar código"}</button>
          </div>
        </>
      ) : (
        <p>Abra esta página no mesmo navegador em que iniciou a matrícula para ver o QR Code.</p>
      )}
      <p role="status" aria-live="polite">Aguardando a confirmação do pagamento… {err}</p>
      <p>A matrícula só fica confirmada quando o pagamento for aprovado. Não envie comprovantes pelo WhatsApp.</p>
    </div>
  );
}
