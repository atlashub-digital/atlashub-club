"use client";
import { useState } from "react";
import Turnstile from "./Turnstile";

/** Pedido de link de entrada (sem senha). Resposta sempre neutra. */
export default function LoginForm({ siteKey }: { siteKey: string }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError("Informe um e-mail válido, por exemplo nome@exemplo.com.");
    if (!token) return setError("Aguarde a verificação anti-robô terminar e tente de novo.");
    setState("sending");
    try {
      const r = await fetch("/api/club/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, turnstileToken: token }),
      });
      if (r.status === 202) return setState("sent");
      const b = (await r.json().catch(() => ({}))) as { message?: string };
      setError(b.message ?? "Não foi possível enviar o link agora.");
    } catch {
      setError("Sem ligação. Verifique a internet e tente de novo.");
    }
    setState("idle");
  }

  if (state === "sent")
    return (
      <p className="ca-notice" role="status">
        <span>
          <strong>Confira o seu e-mail.</strong> Se existir uma conta do Club com este endereço, enviamos um link de entrada. Ele vale por
          pouco tempo e só pode ser usado uma vez.
        </span>
      </p>
    );

  return (
    <form className="ca-card ca-login" onSubmit={submit} noValidate>
      <div className="ca-field">
        <label htmlFor="login-email">E-mail da sua conta</label>
        <input id="login-email" type="email" className="ca-input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" maxLength={190} required />
      </div>
      <Turnstile siteKey={siteKey} onToken={setToken} />
      {error && (
        <p className="ca-field__error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="ca-btn ca-btn--primary" disabled={state === "sending"}>
        {state === "sending" ? "Enviando…" : "Receber link de entrada"}
      </button>
    </form>
  );
}
