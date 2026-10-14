import type { Metadata } from "next";
import MentorCard from "@/components/landing/MentorCard";
import { cast } from "@/lib/cast";

export const metadata: Metadata = { title: "Mentores" };

export default function Mentores() {
  return (
    <section className="ca-section ca-container" aria-labelledby="mentores-title">
      <div className="ca-heading">
        <div>
          <span className="ca-eyebrow">Pessoas + inteligência</span>
          <h1 id="mentores-title" className="ca-page-title">
            Conheça quem constrói com você.
          </h1>
          <p>
            Sérgio Monteiro é uma pessoa real. Atlas, Lucas, Clara e Lia são personagens digitais, sempre identificados
            como tais. Cooperam lado a lado, sem hierarquia, e não decidem nada sobre você sem supervisão humana.
          </p>
        </div>
      </div>
      <div className="ca-mentors ca-mentors--page">
        {cast.map((m) => (
          <MentorCard key={m.key} member={m} headingLevel={2} />
        ))}
      </div>
    </section>
  );
}
