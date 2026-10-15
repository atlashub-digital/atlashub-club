import Link from "next/link";
import ClubLogo from "./brand/ClubLogo";
import { navigation } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="ca-footer">
      <div className="ca-container ca-footer__grid">
        <div className="ca-footer__brand">
          <ClubLogo size="md" tagline />
          <p>Pessoas reais + inteligência viva = um futuro em construção.</p>
          <p className="ca-hand ca-footer__hand">Juntos vamos mais longe.</p>
        </div>
        <nav aria-label="Club Atlas">
          <h2 className="ca-footer__title">Club Atlas</h2>
          <ul>
            {navigation.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Participar e privacidade">
          <h2 className="ca-footer__title">Participar</h2>
          <ul>
            <li><Link href="/participar">Entrar no Club</Link></li>
            <li><Link href="/genesis">Genesis Turma 01</Link></li>
            <li><Link href="/privacidade">Aviso de privacidade</Link></li>
          </ul>
        </nav>
        <nav aria-label="Ecossistema AtlasHub">
          <h2 className="ca-footer__title">Ecossistema</h2>
          <ul>
            <li><a href="https://atlashub.si" target="_blank" rel="noopener noreferrer">AtlasHub.SI<span className="ca-sr-only"> (abre em nova janela)</span></a></li>
            <li><Link href="/biblioteca">AtlasHub Editions</Link></li>
          </ul>
        </nav>
      </div>
      <div className="ca-container ca-footer__fine">
        <span>club.atlashub.si · Uma iniciativa AtlasHub.SI · Conectamos pessoas, ideias e inteligência.</span>
        <span>© AtlasHub · Plataforma em construção — conteúdos e datas sujeitos a confirmação.</span>
      </div>
    </footer>
  );
}
