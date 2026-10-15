// Compatibilidade: o símbolo passou para components/brand/AtlasMark (design system v1.0).
import Mark from "./brand/AtlasMark";
type Props = { size?: number; glow?: boolean; className?: string };
export default function AtlasMark({ size = 40, className }: Props) {
  return <Mark size={size} className={className} />;
}
