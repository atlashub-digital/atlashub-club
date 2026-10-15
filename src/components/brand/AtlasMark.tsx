import { useId } from "react";

type Props = {
  size?: number;
  className?: string;
  /** Rótulo acessível; passar "" quando o símbolo é decorativo ao lado de texto. */
  label?: string;
};

/**
 * Símbolo institucional Atlas — geometria vetorizada a partir de
 * design/reference/approved/ATLAS_HUB_LOGO_FONTE.png (três peças: haste clara,
 * haste azul e base trapezoidal). É o logo corporativo: SEM rosto.
 * A mascote expressiva vive em <AtlasAvatar/>.
 * Vetorização manual provisória — substituir pelo SVG de origem quando for entregue.
 */
export default function AtlasMark({ size = 40, className, label = "Símbolo Atlas" }: Props) {
  const id = useId().replace(/:/g, "");
  const decorative = label === "";
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="250 280 740 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-blue`} x1="560" y1="300" x2="960" y2="880" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1ec8ff" />
          <stop offset="0.55" stopColor="#1677ff" />
          <stop offset="1" stopColor="#0b3bff" />
        </linearGradient>
        <linearGradient id={`${id}-ice`} x1="520" y1="470" x2="300" y2="880" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a9e6ff" />
          <stop offset="0.5" stopColor="#f2fbff" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id={`${id}-base`} x1="610" y1="752" x2="610" y2="880" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfeaff" />
        </linearGradient>
      </defs>
      <path
        d="M540 410 L598 307 Q624 286 652 307 L968 852 Q980 880 950 880 L818 880 Q800 880 790 864 Z"
        fill={`url(#${id}-blue)`}
      />
      <path
        d="M512 474 Q524 456 538 474 L588 570 L402 870 Q396 880 382 880 L284 880 Q258 880 270 860 Z"
        fill={`url(#${id}-ice)`}
      />
      <path
        d="M538 752 L688 752 Q700 752 706 762 L752 864 Q758 880 740 880 L480 880 Q462 880 468 864 L518 762 Q524 752 538 752 Z"
        fill={`url(#${id}-base)`}
      />
    </svg>
  );
}
