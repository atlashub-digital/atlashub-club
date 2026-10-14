import type {Metadata} from "next";
import LeadForm from "@/components/LeadForm";
export const metadata:Metadata={title:"Participar · Club Atlas"};
export default function Participar(){return <><section className="wrap subhero"><p className="kicker">COMEÇA PELO PRIMEIRO PASSO</p><h1>O teu lugar está em construção.</h1><p>Registo gratuito na comunidade e pré-candidatura à jornada Genesis. Sem compromisso de compra, sem promessas de vaga automática.</p></section><LeadForm/></>;}
