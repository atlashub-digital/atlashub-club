/** Canal oficial AtlasHub — entrada assistida enquanto o cadastro Club permanece em preparação.
 * Mensagens contêm apenas a intenção, nunca os dados introduzidos no formulário de demonstração.
 * A URL não implica consentimento para marketing nem inscrição concluída.
 */
const phone = "5562991903462";
function contactUrl(message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
/**
 * Código de captação no fim da mensagem (docs/21_CAMPANHAS_RETOMA.md): permite contar, no atendimento,
 * de que frente e canal veio cada contacto, sem cookies nem dados do formulário.
 * Formato: <FRENTE>-<CANAL>, p. ex. CLUB-SITE, GEN-EA-IG.
 */
export type CampaignFront = "CLUB" | "GEN-EA";
const baseMessage: Record<CampaignFront, string> = {
  CLUB: "Olá! Quero conhecer a comunidade gratuita Club Atlas. Pode me orientar?",
  "GEN-EA": "Olá! Tenho interesse na Turma 01 do Genesis. Inscrições abertas — quero saber como me inscrever.",
};
export function campaignWhatsAppUrl(front: CampaignFront, channel = "SITE"): string {
  return contactUrl(`${baseMessage[front]} (código ${front}-${channel.toUpperCase()})`);
}
export const clubWhatsAppUrl = campaignWhatsAppUrl("CLUB");
export const genesisWhatsAppUrl = campaignWhatsAppUrl("GEN-EA");
