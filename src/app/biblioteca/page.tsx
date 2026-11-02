import type { Metadata } from "next";
import { library } from "@/lib/content";

export const metadata: Metadata = {
  title: "Biblioteca · AtlasHub Editions",
  description: "Livros, guias e materiais da AtlasHub Editions reunidos no Club Atlas, com acesso às leituras disponíveis e estado dos próximos títulos.",
};

export default function Biblioteca() {
  return <>
    <section className="wrap subhero">
      <p className="kicker">CLUB ATLAS · BIBLIOTECA · ATLASHUB EDITIONS</p>
      <h1>O conhecimento também constrói a próxima empresa.</h1>
      <p>Aqui reunimos as publicações e recursos editoriais do ecossistema AtlasHub. Os títulos disponíveis abrem no leitor Editions; os restantes são apresentados como planos e prévias, sem prometer download antecipado.</p>
    </section>
    <section className="wrap content-grid" aria-label="Catálogo editorial">
      {library.map((book) => <article className="glass content-card" key={book.title}>
        <span className="mini-tag">{book.category}</span>
        <h2 style={{ fontSize: "1.4rem" }}>{book.title}</h2>
        <p>{book.description}</p>
        <span className="preview-tag">{book.access}</span>
        <p className="status">{book.status}</p>
        {book.href && <a className="ca-btn ca-btn--ghost" href={book.href} rel="noopener noreferrer">Abrir leitor de Empresa Aumentada ↗</a>}
      </article>)}
    </section>
    <section className="wrap" style={{ paddingBottom: "3rem" }}>
      <p>O catálogo é apresentado no Club Atlas. A aplicação Editions mantém os leitores digitais e os endereços das obras publicados anteriormente, para preservar os links existentes.</p>
    </section>
  </>;
}
