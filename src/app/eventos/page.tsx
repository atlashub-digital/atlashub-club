import type { Metadata } from "next";
import { atlashubWorkshopsLive, events } from "@/lib/content";
export const metadata: Metadata = { title: "Eventos e fóruns" };
export default function Eventos() {
  return (
    <>
      <section className="wrap subhero">
        <p className="kicker">AGENDA EM PREPARAÇÃO</p>
        <h1>Vamos conversar, experimentar e construir.</h1>
        <p>
          Datas previstas. Inscrições e links dos eventos do Club são divulgados depois de confirmados local, equipe, termos e tecnologia. Os
          workshops empresariais são da AtlasHub.SI, pagos e separados da comunidade gratuita.
        </p>
      </section>
      <section className="wrap long-list">
        {events.map((e) => (
          <article className="glass event" key={e.title}>
            <div className="event-date">{e.date}</div>
            <div>
              <span className="mini-tag">
                {e.kind === "b2b" ? "WORKSHOP ATLASHUB.SI · " : ""}
                {e.format} · {e.state}
              </span>
              <h3>{e.title}</h3>
              <p>{e.detail}</p>
              {e.href && atlashubWorkshopsLive && (
                <p>
                  <a href={e.href} target="_blank" rel="noopener noreferrer">
                    Programa e inscrição na AtlasHub.SI ↗
                  </a>
                </p>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
