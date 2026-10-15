import Image from "next/image";
import mascot from "../../../public/assets/club/atlas-mascote.webp";
import type { AtlasState } from "@/lib/atlas/state";

/**
 * PresenceRenderer do Atlas (contrato AAP `setState`).
 * Renderer atual: PNG transparente aprovado + animação CSS por estado.
 * Evolução prevista: renderer GLB (React Three Fiber) com a MESMA interface
 * `{ state, size }` — carregado por import dinâmico só quando o modelo existir,
 * sem acrescentar dependências 3D a este bundle (ver docs/14_ATLAS_COMPANION.md).
 */
export default function AtlasFigure({ state, size = 96, decorative = true }: { state: AtlasState; size?: number; decorative?: boolean }) {
  return (
    <span className="ca-atlas-fig" data-state={state} style={{ width: size, height: Math.round(size * 0.946) }}>
      <span className="ca-atlas-fig__glow" aria-hidden="true" />
      <Image
        src={mascot}
        alt={decorative ? "" : "Atlas, a mascote digital do Club Atlas"}
        width={size}
        height={Math.round(size * 0.946)}
        sizes={`${size}px`}
        className="ca-atlas-fig__img"
      />
    </span>
  );
}
