"use client";

import { useRef, useState } from "react";

const fields = [
  { key: "objective", label: "Objetivo", hint: "Qual resultado pequeno você quer preparar?" },
  { key: "source", label: "Informação e fonte", hint: "Use apenas informações públicas ou fictícias." },
  { key: "action", label: "Ação permitida", hint: "Por exemplo: preparar um rascunho, sem enviar." },
  { key: "stop", label: "Condição de parada", hint: "Quando deve parar e pedir ajuda?" },
  { key: "evidence", label: "Evidência e verificação", hint: "Como você vai conferir o resultado?" },
] as const;
type Answers = Record<(typeof fields)[number]["key"], string>;
const empty: Answers = { objective: "", source: "", action: "", stop: "", evidence: "" };

export default function MissionBuilder() {
  const [answers, setAnswers] = useState<Answers>(empty);
  const [status, setStatus] = useState("");
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const firstRef = useRef<HTMLTextAreaElement>(null);
  const complete = fields.every(({ key }) => answers[key].trim());
  const output = fields.map(({ key, label }) => `${label}: ${answers[key].trim() || "[preencha este campo]"}`).join("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setStatus("Ficha copiada.");
    } catch {
      outputRef.current?.focus();
      outputRef.current?.select();
      setStatus("Cópia automática indisponível. A ficha está selecionada: use Copiar no menu do dispositivo ou Ctrl+C / Command+C.");
    }
  }

  return (
    <section className="ca-card free-stack" aria-labelledby="mission-title">
      <h2 id="mission-title">Monte a missão do seu agente</h2>
      <p id="mission-privacy">Não insira dados pessoais, de clientes, credenciais ou informações confidenciais. Suas respostas ficam apenas nesta página, na memória do navegador: não são salvas nem enviadas. Não há chamada de IA. Ao sair ou recarregar, elas são perdidas. Copiar coloca a ficha na área de transferência do dispositivo.</p>
      <noscript>Ative JavaScript para montar e copiar a ficha, ou escreva as cinco partes em um editor de texto local.</noscript>
      <div className="free-fields" aria-describedby="mission-privacy">
        {fields.map(({ key, label, hint }, index) => (
          <div key={key}>
            <label htmlFor={`mission-${key}`}>{label}</label>
            <p id={`hint-${key}`}>{hint}</p>
            <textarea ref={index === 0 ? firstRef : undefined} id={`mission-${key}`} rows={3} maxLength={1200}
              autoComplete="off" spellCheck={false} aria-describedby={`hint-${key}`} value={answers[key]}
              onChange={(event) => { setAnswers({ ...answers, [key]: event.target.value }); setStatus(""); }} />
          </div>
        ))}
      </div>
      <label htmlFor="mission-output">Sua ficha de missão</label>
      <textarea id="mission-output" ref={outputRef} value={output} readOnly rows={10} />
      <div className="free-actions">
        <button className="ca-btn ca-btn--primary" type="button" disabled={!complete} onClick={copy}>Copiar missão</button>
        <button className="ca-btn ca-btn--outline" type="button" onClick={() => { setAnswers(empty); setStatus("Campos e ficha limpos."); firstRef.current?.focus(); }}>Limpar</button>
      </div>
      <p>Preencha as cinco partes para copiar. Você também pode selecionar a ficha e copiar manualmente.</p>
      <p role="status" aria-live="polite">{status}</p>
    </section>
  );
}
