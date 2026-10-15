/** Canal oficial AtlasHub — entrada assistida enquanto o cadastro Club permanece em preparação.
 * Mensagens contêm apenas a intenção, nunca os dados introduzidos no formulário de demonstração.
 * A URL não implica consentimento para marketing nem inscrição concluída.
 */
const phone = "5562991903462";
function contactUrl(message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
export const clubWhatsAppUrl = contactUrl("Olá! Quero conhecer a comunidade gratuita Club Atlas. Pode me orientar?");
export const genesisWhatsAppUrl = contactUrl("Olá! Tenho interesse na Turma 01 do Genesis. Quero entender as condições antes da pré-inscrição.");
