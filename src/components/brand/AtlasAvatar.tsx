import Image from "next/image";
import atlasPortrait from "../../../public/assets/club/portrait-atlas.webp";

type Props = {
  size?: number;
  /** Animação suave (flutuar + brilho). Desligada automaticamente com prefers-reduced-motion. */
  animated?: boolean;
  priority?: boolean;
  className?: string;
};

/**
 * Mascote viva Atlas — triângulo 3D expressivo, recortado da composição aprovada
 * (CLUB_ATLAS_TEAM_VALIDADO.png). Uso distinto do logótipo institucional (AtlasMark).
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
        src={atlasPortrait}
        alt="Atlas, mascote digital do Club Atlas: um triângulo azul e prateado com rosto sorridente"
        width={size}
        height={size}
        sizes={`${size}px`}
        priority={priority}
        className="ca-avatar__img"
      />
    </span>
  );
}
