import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export const metadata:Metadata={
 title:{default:"Club Atlas — O teu agente. O teu laboratório. O teu mundo.",template:"%s | Club Atlas"},
 description:"Uma comunidade para aprender, experimentar e construir com agentes de inteligência artificial. Club gratuito, encontros, Atlas Lab e Genesis.",
 robots:{index:false,follow:false},
};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="pt-BR"><body><SiteHeader/><main id="conteudo">{children}</main><SiteFooter/></body></html>;
}
