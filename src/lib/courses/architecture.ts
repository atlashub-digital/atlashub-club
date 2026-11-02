/** Oferta de arranque aprovada por Sérgio: não inclui o pack ampliado. */
export const architectureCourse = {
  slug: "arquitetura-superinteligencia-agentica",
  title: "A Arquitetura da Superinteligência Agêntica",
  subtitle: "Da operação real à empresa aumentada",
  priceMinor: 14700,
  currency: "BRL",
  courseUrl: "https://app.club.atlashub.si/course/a37ae2a4-8a23-456c-9b2f-61447e38e9c4",
  loginUrl: "https://app.club.atlashub.si/login",
  sessions: [
    { date: "2026-11-05", label: "5 de novembro", number: "01" },
    { date: "2026-11-12", label: "12 de novembro", number: "02" },
    { date: "2026-11-19", label: "19 de novembro", number: "03" },
  ],
} as const;

export const architecturePrice = new Intl.NumberFormat("pt-BR", {
  style: "currency", currency: architectureCourse.currency, maximumFractionDigits: 0,
}).format(architectureCourse.priceMinor / 100);

type Env = Record<string, string | undefined>;

/** URLs de publicação, nunca tokens/segredos; não cria sessão nem concede direitos. */
function publicHttpsUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (!url.hostname.includes(".") || /(^|\.)(localhost|example\.(com|org|net)|invalid)$/.test(url.hostname)) return null;
    return url.toString();
  } catch { return null; }
}

/** A flag só é configurada pela operação após provar compra → acesso e condições. */
export function architectureCheckout(env: Env) {
  const checkoutUrl = publicHttpsUrl(env.ARCHITECTURE_CHECKOUT_URL);
  const termsUrl = publicHttpsUrl(env.ARCHITECTURE_TERMS_URL);
  return env.ARCHITECTURE_CHECKOUT_READY === "true" && checkoutUrl && termsUrl
    ? { checkoutUrl, termsUrl }
    : null;
}

export const architectureContactUrl = "https://wa.me/5562991903462?text=" + encodeURIComponent(
  "Olá! Quero informações sobre A Arquitetura da Superinteligência Agêntica, com pagamento único de " +
  architecturePrice + " e lives em 5, 12 e 19 de novembro. (código ASIA-SITE)",
);
