import Link from "next/link";
import ClubLogo from "./brand/ClubLogo";
import MobileNav from "./layout/MobileNav";
import NavLinks from "./layout/NavLinks";
import { LinkButton } from "./ui/primitives";
import { primaryCta } from "@/lib/flags";

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
          <LinkButton href="/participar" size="sm" icon={null} variant={primaryCta} className="ca-header__cta">
            Entrar no Club
          </LinkButton>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
