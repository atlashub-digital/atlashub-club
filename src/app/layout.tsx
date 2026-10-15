import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/caveat/500.css";
import "./globals.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/layout.css";
import "@/styles/landing.css";
import "@/styles/design-system.css";
import "@/styles/atlas.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AtlasCompanion from "@/components/atlas/AtlasCompanion";

const siteUrl = process.env.CLUB_SITE_ORIGIN || "https://club.atlashub.si";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Club Atlas — Pessoas reais. Agentes próprios. Projetos vivos.", template: "%s | Club Atlas" },
  description:
    "Comunidade para aprender, construir e crescer com agentes de IA. Para estudantes de todas as áreas, iniciantes, criadores e empreendedores. Entrada gratuita, mentoria humana + IA e o programa Genesis.",
  // Preview: manter noindex até homologação de SEO/conteúdo (docs/11_DEPLOYMENT.md).
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Club Atlas",
    title: "Club Atlas — Pessoas reais. Agentes próprios. Projetos vivos.",
    description: "Pessoas reais + inteligência viva. Aprender · Construir · Crescer · Realizar.",
    images: [{ url: "/assets/club/og-club-atlas.jpg", width: 1200, height: 630, alt: "Elenco do Club Atlas: Sérgio Monteiro, Lucas, Atlas, Marta e Bia" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#050b17",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="ca-skip" href="#conteudo">
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <AtlasCompanion />
      </body>
    </html>
  );
}
