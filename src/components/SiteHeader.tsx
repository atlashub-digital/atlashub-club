import Link from "next/link";
import ClubLogo from "./brand/ClubLogo";
import MobileNav from "./layout/MobileNav";
import NavLinks from "./layout/NavLinks";
import { LinkButton } from "./ui/primitives";

export default function SiteHeader() {
  return (
    <header className="ca-header">
      <div className="ca-container ca-header__inner">
        <Link href="/" className="ca-header__brand" aria-label="Club Atlas, página inicial">
          <ClubLogo size="sm" />
        </Link>
        <nav className="ca-header__nav" aria-label="Navegação principal">
          <NavLinks />
        </nav>
        <div className="ca-header__actions">
          <LinkButton href="/participar" size="sm" icon={null} className="ca-header__cta">
            <span>
              Entrar no Club<span className="ca-header__cta-free"> (gratuito)</span>
            </span>
          </LinkButton>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
