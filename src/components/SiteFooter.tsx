import Link from "next/link";
import AtlasMark from "./AtlasMark";
export default function SiteFooter(){
 return <footer className="footer"><div className="wrap footer-grid"><div className="footer-brand"><AtlasMark size={32}/><span>CLUB ATLAS<small>by AtlasHub.SI</small></span></div><p>Pessoas. Ideias. Agentes. Projetos reais.<br/>Construímos juntos, com consciência e responsabilidade.</p><div><Link href="/privacidade">Privacidade</Link><Link href="/eventos">Eventos</Link><Link href="/participar">Participar</Link></div></div><div className="wrap fineprint">© AtlasHub · People | Technology | Results · Uma experiência de aprendizagem em construção.</div></footer>;
}
