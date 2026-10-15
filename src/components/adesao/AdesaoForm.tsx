"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import Icon from "../ui/Icon";
import { StatusTag } from "../ui/primitives";
import { genesisFacts, price, priceNotes } from "@/lib/offers";
import { ageBandLabels, deriveSignupOutcome, isMinor, statusLabels, type AgeBand } from "@/lib/adesao/status";

/**
 * Formulário de adesão em 4 etapas — MODO PRÉVIA (issue #14, PR2A).
 * Não envia, não guarda e não chama nenhuma API: o estado vive só na memória desta página.
 * Auth, CRM, validação de estudante e checkout entram em PRs próprios (PR2B/PR2C).
 * Regras: Club grátis por defeito; Genesis só por escolha explícita (ou ?plan=genesis);
 * marcar "estudante" NÃO autoriza R$ 190 — fica "pendente de validação"; marketing desmarcado.
 * Menores de 18 (decisão de 14/10/2026): avançam sem bloqueio; o percurso fica em `pending_guardian_review`
 * (revisão manual do responsável pela equipa). Não há consentimento simulado nem campo "tenho autorização".
 */

export type Plan = "club" | "genesis";
type Age = "" | AgeBand;

type Draft = {
  plan: Plan;
  student: boolean;
  institution: string;
  name: string;
  email: string;
  whatsapp: string;
  age: Age;
  area: string;
  interests: string[];
  firstMission: string;
  device: string;
  terms: boolean;
  marketing: boolean;
};

const STEPS = ["Percurso", "Dados", "Interesses", "Revisão"] as const;

const INTERESTS = [
  "Agente pessoal para estudar",
  "Pesquisa e escrita",
  "Criação de conteúdo",
  "Negócio ou loja online",
  "Programação e automações",
  "Comunidade e projetos em equipe",
];

const AREAS = [
  "Ainda não estou estudando",
  "Saúde",
  "Direito e humanas",
  "Engenharia e tecnologia",
  "Gestão, economia e negócios",
  "Artes, design e comunicação",
  "Educação",
  "Outra área",
];

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export default function AdesaoForm({ initialPlan = "club" }: { initialPlan?: Plan }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [d, setD] = useState<Draft>({
    plan: initialPlan,
    student: false,
    institution: "",
    name: "",
    email: "",
    whatsapp: "",
    age: "",
    area: "",
    interests: [],
    firstMission: "",
    device: "",
    terms: false,
    marketing: false,
  });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const f = (k: string) => `${uid}-${k}`;

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {
    headingRef.current?.focus();
  }, [step, done]);

  useEffect(() => {
    if (Object.keys(errors).length) summaryRef.current?.focus();
  }, [errors]);

  const minor = d.age !== "" && isMinor(d.age);
  const child = d.age === "child";
  const outcome = d.age ? deriveSignupOutcome({ plan: d.plan, student: d.student, age: d.age }) : null;

  function validate(s: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (d.name.trim().length < 2) e.name = "Informe o seu nome (mínimo 2 letras).";
      // Menos de 12 anos: nenhum contacto direto da criança — o contacto é sempre o do responsável.
      if (!child && !emailOk(d.email)) e.email = "Informe um e-mail válido, por exemplo nome@exemplo.com.";
      if (!minor && d.whatsapp && d.whatsapp.replace(/\D/g, "").length < 10) e.whatsapp = "WhatsApp é opcional; se preencher, use DDD + número.";
      if (!d.age) e.age = "Indique a sua faixa de idade.";
    }
    if (s === 2) {
      if (d.firstMission.trim().length < 5) e.firstMission = "Conte em poucas palavras qual seria a primeira missão do seu agente.";
    }
    if (s === 3) {
      if (!d.terms) e.terms = "Para continuar, aceite os termos e o aviso de privacidade.";
    }
    return e;
  }

  function next() {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else setDone(true);
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  const err = (k: string) =>
    errors[k] ? (
      <small id={f(k + "-err")} className="ca-field__error">
        {errors[k]}
      </small>
    ) : null;
  const errProps = (k: string) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": f(k + "-err") } : {};

  const planLabel = d.plan === "club" ? "Club Atlas · gratuito" : `Genesis Turma 01 · ${genesisFacts.weeks} semanas`;
  const priceLabel =
    d.plan === "club" ? price.club : d.student ? `${price.genesisStudent} (pendente de validação)` : `${price.genesisStandard} (valor padrão)`;

  if (done) {
    return (
      <div className="ca-adesao">
        <section className="ca-card ca-card--glow ca-adesao__done" aria-labelledby="adesao-done">
          <span className="ca-icon-box">
            <Icon name="check" />
          </span>
          <h2 id="adesao-done" ref={headingRef} tabIndex={-1}>
            Prévia concluída — nada foi enviado.
          </h2>
          <p>
            Este é o fluxo de adesão em <strong>modo demonstração</strong>. Nenhum dado foi enviado, guardado ou compartilhado, e
            nenhuma conta foi criada. O cadastro real abre quando a autenticação e os consentimentos forem aprovados.
          </p>
          <dl className="ca-adesao__review">
            <div>
              <dt>Percurso</dt>
              <dd>{planLabel}</dd>
            </div>
            <div>
              <dt>Valor</dt>
              <dd>{priceLabel}</dd>
            </div>
          </dl>
          {d.plan === "genesis" && <p className="ca-adesao__hint">{priceNotes.noCharge}</p>}
          {outcome && <OutcomePanel outcome={outcome} />}
          <div className="ca-hero__actions">
            <Link className="ca-btn ca-btn--primary" href={`/area-membro${d.plan === "genesis" ? "?plan=genesis" : ""}`}>
              Ver a prévia do dashboard <Icon name="arrow" className="ca-btn__icon" />
            </Link>
            <button type="button" className="ca-btn ca-btn--outline" onClick={() => { setDone(false); setStep(0); }}>
              Rever respostas
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ca-adesao">
      <form
        className="ca-card ca-adesao__form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        aria-labelledby={f("title")}
      >
        <ol className="ca-adesao__steps" aria-label="Etapas do formulário">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className={i < step ? "is-done" : i === step ? "is-current" : ""}>
              <span aria-hidden="true">{i < step ? "✓" : i + 1}</span> {s}
            </li>
          ))}
        </ol>

        <h2 id={f("title")} ref={headingRef} tabIndex={-1} className="ca-adesao__title">
          <span className="ca-sr-only">Etapa {step + 1} de 4: </span>
          {["Escolha o seu percurso", "Dados mínimos", "O que você quer construir?", "Revisão e consentimentos"][step]}
        </h2>

        {Object.keys(errors).length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="ca-adesao__errors">
            <strong>Revise {Object.keys(errors).length === 1 ? "o campo" : "os campos"} abaixo:</strong>
            <ul>
              {Object.entries(errors).map(([k, v]) => (
                <li key={k}>
                  <a href={`#${f(k)}`}>{v}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 0 && (
          <fieldset className="ca-adesao__fieldset">
            <legend className="ca-sr-only">Percurso</legend>
            <label className={`ca-choice ${d.plan === "club" ? "is-selected" : ""}`}>
              <input type="radio" name="plan" value="club" checked={d.plan === "club"} onChange={() => set("plan", "club")} />
              <span>
                <strong>Club Atlas — {price.club}</strong>
                <small>Comunidade, conteúdos introdutórios, desafios e a Missão 001. Não depende de comprar nada.</small>
              </span>
            </label>
            <label className={`ca-choice ca-choice--gold ${d.plan === "genesis" ? "is-selected" : ""}`}>
              <input type="radio" name="plan" value="genesis" checked={d.plan === "genesis"} onChange={() => set("plan", "genesis")} />
              <span>
                <strong>
                  Genesis Turma 01 — {price.genesisStandard} <em>ou {price.genesisStudent} estudante elegível</em>
                </strong>
                <small>
                  {genesisFacts.weeks} semanas, {genesisFacts.ateliers} ateliers previstos, comunidade Club incluída. Início previsto{" "}
                  {genesisFacts.start}.
                </small>
              </span>
            </label>

            {d.plan === "genesis" && (
              <div className="ca-adesao__student">
                <label className="check-inline">
                  <input type="checkbox" checked={d.student} onChange={(e) => set("student", e.target.checked)} />
                  <span>Sou estudante e quero pedir a condição de {price.genesisStudent}</span>
                </label>
                {d.student && (
                  <>
                    <div className="ca-field">
                      <label htmlFor={f("institution")}>Instituição de ensino (opcional nesta prévia)</label>
                      <input
                        id={f("institution")}
                        className="ca-input"
                        value={d.institution}
                        onChange={(e) => set("institution", e.target.value)}
                        autoComplete="organization"
                        maxLength={120}
                      />
                    </div>
                    <p className="ca-notice" role="note">
                      <span>
                        <strong>Sujeito a validação de elegibilidade.</strong> Marcar esta opção não garante o valor de{" "}
                        {price.genesisStudent}: o comprovativo será pedido depois e analisado antes de qualquer pagamento. Se não for
                        aprovado, você pode continuar pelo valor padrão ou só no Club grátis.
                      </span>
                    </p>
                  </>
                )}
              </div>
            )}
          </fieldset>
        )}

        {step === 1 && (
          <div className="ca-adesao__grid">
            <fieldset className="ca-field ca-adesao__wide" id={f("age")}>
              <legend>Faixa de idade</legend>
              <div className="ca-adesao__inline">
                {(Object.keys(ageBandLabels) as AgeBand[]).map((band) => (
                  <label key={band} className="check-inline">
                    <input
                      type="radio"
                      name="age"
                      checked={d.age === band}
                      onChange={() =>
                        setD((prev) => ({
                          ...prev,
                          age: band,
                          whatsapp: isMinor(band) ? "" : prev.whatsapp,
                          email: band === "child" ? "" : prev.email,
                        }))
                      }
                      {...(errors.age ? { "aria-describedby": f("age-err") } : {})}
                    />{" "}
                    <span>{ageBandLabels[band]}</span>
                  </label>
                ))}
              </div>
              {err("age")}
            </fieldset>
            {minor && <GuardianNote child={d.age === "child"} genesis={d.plan === "genesis"} />}
            <div className="ca-field">
              <label htmlFor={f("name")}>{minor ? "Nome ou apelido" : "Nome"}</label>
              <input id={f("name")} className="ca-input" value={d.name} onChange={(e) => set("name", e.target.value)} autoComplete={minor ? "nickname" : "name"} maxLength={90} {...errProps("name")} />
              {err("name")}
            </div>
            {child ? (
              <p className="ca-adesao__hint ca-adesao__wide">
                Não pedimos o seu e-mail nem outro contacto: para menores de 12 anos, quem fala com a equipe é sempre o
                responsável legal.
              </p>
            ) : (
              <div className="ca-field">
                <label htmlFor={f("email")}>E-mail</label>
                <input id={f("email")} type="email" className="ca-input" value={d.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" maxLength={190} {...errProps("email")} />
                {err("email")}
              </div>
            )}
            {!minor && (
              <div className="ca-field">
                <label htmlFor={f("whatsapp")}>WhatsApp (opcional)</label>
                <input id={f("whatsapp")} type="tel" inputMode="tel" className="ca-input" value={d.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} autoComplete="tel" maxLength={20} {...errProps("whatsapp")} />
                {err("whatsapp")}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="ca-adesao__grid">
            <div className="ca-field ca-adesao__wide">
              <label htmlFor={f("firstMission")}>Se você pudesse criar um agente só seu, qual seria sua primeira missão?</label>
              <textarea id={f("firstMission")} className="ca-input ca-textarea" rows={3} value={d.firstMission} onChange={(e) => set("firstMission", e.target.value)} maxLength={400} placeholder="Ex.: organizar o meu semestre e me lembrar das entregas" {...errProps("firstMission")} />
              {err("firstMission")}
            </div>
            <fieldset className="ca-field ca-adesao__wide">
              <legend>Interesses (opcional)</legend>
              <div className="ca-adesao__chips">
                {INTERESTS.map((i) => (
                  <label key={i} className={`ca-chip ${d.interests.includes(i) ? "is-on" : ""}`}>
                    <input
                      type="checkbox"
                      checked={d.interests.includes(i)}
                      onChange={(e) => set("interests", e.target.checked ? [...d.interests, i] : d.interests.filter((x) => x !== i))}
                    />
                    {i}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="ca-field">
              <label htmlFor={f("area")}>Área de estudo ou trabalho (opcional)</label>
              <select id={f("area")} className="ca-input" value={d.area} onChange={(e) => set("area", e.target.value)}>
                <option value="">Selecione</option>
                {AREAS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="ca-field">
              <label htmlFor={f("device")}>Equipamento para participar (opcional)</label>
              <select id={f("device")} className="ca-input" value={d.device} onChange={(e) => set("device", e.target.value)}>
                <option value="">Selecione</option>
                <option>Só celular</option>
                <option>Computador</option>
                <option>Equipamento compartilhado</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="ca-adesao__grid">
            <dl className="ca-adesao__review ca-adesao__wide">
              <div>
                <dt>Percurso</dt>
                <dd>{planLabel}</dd>
              </div>
              <div>
                <dt>Valor</dt>
                <dd>{priceLabel}</dd>
              </div>
              <div>
                <dt>Nome</dt>
                <dd>{d.name}</dd>
              </div>
              <div>
                <dt>{child ? "Contacto" : "E-mail"}</dt>
                <dd>{child ? "Através do responsável legal" : d.email}</dd>
              </div>
              <div className="ca-adesao__wide">
                <dt>Primeira missão</dt>
                <dd>{d.firstMission}</dd>
              </div>
              {outcome && (
                <div className="ca-adesao__wide">
                  <dt>Estado previsto</dt>
                  <dd>
                    {statusLabels[outcome.status]} <code className="ca-adesao__code">{outcome.status}</code>
                  </dd>
                </div>
              )}
            </dl>
            <label className="check-inline ca-adesao__wide" htmlFor={f("terms")}>
              <input id={f("terms")} type="checkbox" checked={d.terms} onChange={(e) => set("terms", e.target.checked)} {...errProps("terms")} />
              <span>
                Li e aceito os termos de participação e o <Link href="/privacidade">aviso de privacidade</Link> (obrigatório).
              </span>
            </label>
            {err("terms")}
            <label className="check-inline ca-adesao__wide" htmlFor={f("marketing")}>
              <input id={f("marketing")} type="checkbox" checked={d.marketing} onChange={(e) => set("marketing", e.target.checked)} />
              <span>Quero receber novidades do Club Atlas e do Genesis por e-mail (opcional; pode cancelar quando quiser).</span>
            </label>
          </div>
        )}

        <div className="ca-adesao__nav">
          {step > 0 && (
            <button type="button" className="ca-btn ca-btn--outline" onClick={back}>
              Voltar
            </button>
          )}
          <button type="submit" className={`ca-btn ${d.plan === "genesis" ? "ca-btn--gold" : "ca-btn--primary"}`}>
            {step < 3 ? "Continuar" : "Concluir prévia (nada é enviado)"}
            <Icon name="arrow" className="ca-btn__icon" />
          </button>
        </div>
      </form>

      <aside className="ca-card ca-adesao__summary" aria-labelledby={f("sum")}>
        <h2 id={f("sum")}>Resumo</h2>
        <StatusTag status={d.plan === "club" ? "free" : "premium"}>{d.plan === "club" ? "Gratuito" : "Genesis"}</StatusTag>
        <p className="ca-adesao__plan">{planLabel}</p>
        <p className="ca-adesao__price" aria-live="polite">
          {priceLabel}
        </p>
        {d.plan === "genesis" && (
          <>
            <p className="ca-adesao__hint">{d.student ? priceNotes.student : `Estudante elegível: ${price.genesisStudent}, após validação.`}</p>
            <p className="ca-adesao__hint">{priceNotes.noCharge}</p>
          </>
        )}
        {d.plan === "club" && (
          <p className="ca-adesao__hint">
            Quer ir mais longe? O Genesis é opcional: {price.genesisStandard} padrão ou {price.genesisStudent} para estudantes elegíveis.{" "}
            <button type="button" className="ca-linkbtn" onClick={() => { set("plan", "genesis"); setStep(0); }}>
              Ver opção Genesis
            </button>
          </p>
        )}
        {minor && (
          <p className="ca-adesao__hint">
            Percurso sujeito a <strong>revisão do responsável</strong>. Nada é ativado nem cobrado antes dessa revisão.
          </p>
        )}
        <p className="ca-adesao__demo">
          <Icon name="shield" size={16} /> Prévia: nada é enviado nem guardado.
        </p>
      </aside>
    </div>
  );
}

/** Mensagem positiva para menores: informa, não bloqueia e não simula autorização. */
function GuardianNote({ child, genesis }: { child: boolean; genesis: boolean }) {
  return (
    <div className="ca-notice ca-notice--welcome ca-adesao__wide" role="note">
      <Icon name="sparkle" size={18} />
      <span>
        <strong>Que bom ter você aqui!</strong> O Club Atlas é para quem está aprendendo, em qualquer idade. Você pode
        continuar a explorar e terminar esta pré-inscrição. Alguns passos — como criar a conta, usar dados pessoais
        {genesis ? ", entrar no Genesis ou qualquer pagamento" : " ou participar de atividades com inscrição"} — vão
        precisar da autorização de um responsável. A nossa equipe revisa cada caso com cuidado antes de ativar algo.
        {child && " Para menores de 12 anos, o responsável participa desde o início do registro."}
      </span>
    </div>
  );
}

function OutcomePanel({ outcome }: { outcome: ReturnType<typeof deriveSignupOutcome> }) {
  return (
    <div className="ca-adesao__outcome" aria-labelledby="adesao-outcome">
      <h3 id="adesao-outcome">
        Estado previsto no sistema real: {statusLabels[outcome.status]} <code className="ca-adesao__code">{outcome.status}</code>
      </h3>
      <ul>
        {outcome.reviews.guardian && (
          <li>
            <strong>Revisão do responsável:</strong> a equipe do Club entra em contato e valida a autorização do responsável legal,
            caso a caso. Até lá não é criada conta com dados pessoais.
          </li>
        )}
        {outcome.reviews.student && (
          <li>
            <strong>Validação de estudante:</strong> verificação independente da elegibilidade antes de qualquer valor de
            estudante.
          </li>
        )}
        {!outcome.reviews.guardian && !outcome.reviews.student && <li>Sem revisão manual necessária para este percurso.</li>}
      </ul>
      {outcome.onHold.length > 0 && (
        <p className="ca-adesao__hint">
          Fica em espera até a revisão: {outcome.onHold.join(" · ")}. As páginas públicas do Club continuam abertas.
        </p>
      )}
    </div>
  );
}
