// Condições de venda do Genesis Turma 01, mostradas antes do pagamento e aceites no formulário.
// Mudar o texto exige subir `genesisTermsVersion` (fica gravado em cada matrícula).
import { genesisFacts } from "../offers";

export const genesisTermsVersion = "genesis-01-2026-10-v1";

export const genesisConditions: { title: string; text: string }[] = [
  { title: "O que é a matrícula", text: `Turma 01 do Genesis: ${genesisFacts.weeks} semanas, ${genesisFacts.ateliers} ateliers, início previsto em ${genesisFacts.start}, ${genesisFacts.format}. A comunidade do Club continua gratuita e separada desta matrícula.` },
  { title: "Pagamento", text: "PIX pelo sistema de pagamentos da AtlasHub (ARO). A matrícula só fica confirmada depois de o pagamento ser aprovado; não aceitamos comprovantes por WhatsApp como confirmação." },
  { title: "Condição de estudante", text: "O valor de estudante só aparece depois de a equipe aprovar a sua validação. Sem aprovação, aplica-se o valor padrão." },
  { title: "Desistência", text: "Reembolso integral se pedir em até 7 dias depois do pagamento (direito de arrependimento, CDC art. 49)." },
  { title: "Antes do início", text: "Depois desse prazo e até 7 dias antes do início da turma, pode pedir o reembolso integral ou passar a matrícula para a turma seguinte." },
  { title: "Adiamento ou cancelamento pela AtlasHub", text: "Você escolhe entre a nova data e o reembolso integral, sem custos." },
  { title: "Ateliers extras de dezembro", text: "As datas dos 2 ateliers extras do Early Access ainda não estão definidas; são decididas depois de seis inscrições qualificadas e comunicadas por convite." },
];
