import Image from "next/image";
import atlasMascot from "../../../public/assets/club/atlas-mascote.webp";

type Props = {
  size?: number;
  /** Animação suave (flutuar + brilho). Desligada automaticamente com prefers-reduced-motion. */
  animated?: boolean;
  priority?: boolean;
  className?: string;
};

/**
 * Mascote viva Atlas — triângulo 3D expressivo (PNG transparente aprovado,
 * design/reference/approved/ATLAS_MASCOTE_TRANSPARENTE.png). Uso distinto do logótipo institucional (AtlasMark).
 * Não captura microfone/câmara nem inicia chat: é presença visual apenas.
 */
export default function AtlasAvatar({ size = 160, animated = true, priority = false, className = "" }: Props) {
  return (
    <span
      className={`ca-avatar ${animated ? "ca-avatar--animated" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="ca-avatar__halo" aria-hidden="true" />
      <Image
        src={atlasMascot}
        alt="Atlas, mascote digital do Club Atlas: um triângulo azul e dourado com rosto sorridente sobre um pedestal luminoso"
        width={size}
        height={size}
        sizes={`${size}px`}
        priority={priority}
        className="ca-avatar__img"
      />
    </span>
  );
}
