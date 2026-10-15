/**
 * Variante do CTA principal em avaliação (revisão Sérgio, PR #11 §B):
 * - "gold": botão dourado/âmbar do DESIGN_SYSTEM_BOARD §05 (padrão desta revisão)
 * - "blue": azul elétrico do WEB_ECOSISTEMA (versão inicial do PR1)
 * Definida no build por NEXT_PUBLIC_HERO_CTA; comparação em design/comparisons/pr1/06_cta-variantes.jpg.
 */
export type CtaVariant = "gold" | "blue";
export const heroCtaVariant: CtaVariant = process.env.NEXT_PUBLIC_HERO_CTA === "blue" ? "blue" : "gold";
export const primaryCta = heroCtaVariant === "gold" ? "gold" : "primary";
