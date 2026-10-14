import AtlasMark from "./AtlasMark";

type Props = {
  /** "full" = símbolo + texto CLUB ATLAS (barra de navegação); "wordmark" = CLUB ATLAS com o A triangular; "symbol" = só o símbolo. */
  variant?: "full" | "wordmark" | "symbol";
  tagline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

/**
 * Logótipo Club Atlas em DOM (texto real + símbolo SVG), conforme board
 * DESIGN_SYSTEM_BOARD secção 01. O "A" de ATLAS é o símbolo institucional.
 */
export default function ClubLogo({ variant = "full", tagline = false, size = "md", className = "" }: Props) {
  if (variant === "symbol") return <AtlasMark size={size === "sm" ? 28 : size === "lg" ? 56 : 36} label="Club Atlas" className={className} />;
  return (
    <span className={`ca-logo ca-logo--${size} ${className}`} role="img" aria-label="Club Atlas">
      <span className="ca-logo__row" aria-hidden="true">
        {variant === "full" && <AtlasMark className="ca-logo__symbol" label="" />}
        {variant === "full" ? (
          <span className="ca-logo__word">
            CLUB<span className="ca-logo__gap" />
            <span className="ca-logo__atlas">ATLAS</span>
          </span>
        ) : (
          <span className="ca-logo__word">
            CLUB<span className="ca-logo__gap" />
            <AtlasMark className="ca-logo__a" label="" />
            <span className="ca-logo__atlas">TLAS</span>
          </span>
        )}
      </span>
      {tagline && (
        <span className="ca-logo__tagline" aria-hidden="true">
          Aprender · Construir · Crescer · Realizar
        </span>
      )}
    </span>
  );
}
