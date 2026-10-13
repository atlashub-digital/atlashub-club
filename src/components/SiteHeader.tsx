import Link from "next/link";
import AtlasMark from "./AtlasMark";
import {navigation} from "@/lib/content";
export default function SiteHeader(){
 return <header className="topbar"><div className="wrap topbar-inner">
   <Link className="wordmark" href="/" aria-label="Club Atlas, início"><AtlasMark size={31}/><span>CLUB <b>ATLAS</b><small>by ATLASHUB.SI</small></span></Link>
   <nav className="navigation" aria-label="Navegação principal">{navigation.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
   <Link className="nav-cta" href="/participar">Entrar no Club <span aria-hidden>↗</span></Link>
 </div></header>;
}
