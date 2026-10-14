import Image from "next/image";
import type { CastMember } from "@/lib/cast";
import { StatusTag } from "../ui/primitives";

/** Cartão de mentor (board DESIGN_SYSTEM secção 11), com declaração humano/digital explícita. */
export default function MentorCard({ member, headingLevel = 3 }: { member: CastMember; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={`ca-card ca-mentor ${member.key === "atlas" ? "ca-card--glow" : ""}`}>
      <div className="ca-mentor__media">
        <Image src={member.portrait} alt={member.portraitAlt} sizes="(max-width: 600px) 90vw, 240px" className="ca-mentor__img" />
      </div>
      <div className="ca-mentor__body">
        <StatusTag status={member.kind === "human" ? "human" : "digital"} />
        <H className="ca-mentor__name">{member.displayName}</H>
        <p className="ca-mentor__role">{member.role}</p>
        <p className="ca-mentor__keywords">{member.keywords}</p>
        <p className="ca-hand ca-mentor__quote">“{member.quote}”</p>
        <p className="ca-mentor__summary">{member.summary}</p>
      </div>
    </article>
  );
}
