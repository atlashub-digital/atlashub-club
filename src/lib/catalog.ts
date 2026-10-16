/**
 * Catálogo das 4 ofertas para o atendimento (Clara no WhatsApp oficial e equipa humana).
 * Fonte única: deriva de offers.ts, contact.ts e content.ts, para nunca divergir do site.
 * Publicado em /catalogo.json (noindex). Não contém dados pessoais, segredos nem preços não aprovados.
 * Regras: docs/25_CLARA_CATALOGO.md.
 */
import { campaignWhatsAppUrl } from "./contact";
import { earlyAccess, earlyAccessAteliers, genesisFacts, price, priceNotes } from "./offers";

const club = "https://club.atlashub.si";
const si = "https://www.atlashub.si";

/** Proibições que valem para qualquer oferta. */
export const catalogGuardrails = [
  "Não anunciar vagas, lugares restantes, lotes a esgotar ou urgência artificial.",
  "Não indicar datas, horários nem local dos 2 ateliers de dezembro do Early Access: só serão decididos depois de mais de cinco inscrições qualificadas.",
  "Não indicar local exato dos workshops nem afirmar espaço reservado: o local é 'a divulgar'.",
  "Não pedir, aceitar nem confirmar pagamentos. Nenhum checkout está ativo. Nunca declarar 'pago' por comprovativo: só o ARO confirma.",
  "Não pedir cartão, CPF, senhas nem dados de provedores de pagamento na conversa.",
  "Não dizer que o cadastro de membros, a área de membros ou a Missão 001 já estão operacionais.",
  "Não criar contas nem inscrições em nome da pessoa. Quando o cadastro abrir, enviar só o link oficial.",
  "Não inventar métricas, depoimentos, descontos adicionais, parcelamento nem garantias de resultado.",
  "Menores de 18: só com o responsável; não recolher contactos de crianças; nada de CRM, conta ou cobrança antes da aprovação do responsável.",
  "Marketing só com consentimento expresso e separado; parar imediatamente após pedido de saída (opt-out).",
  "Dúvida fora do catálogo, reclamação, pedido jurídico ou de dados pessoais → passar para atendimento humano.",
] as const;

export function buildCatalog() {
  return {
    version: "1",
    updated: "2026-10-16",
    whatsapp: "+55 62 99190-3462",
    codeFormat: "<FRENTE>-<CANAL>; canais: SITE, IG, LI, FB, WA (parceiros), EVT (presencial/QR). O código vem no fim da mensagem pré-preenchida e regista-se no CRM.",
    paymentRouting: {
      status: "indisponivel",
      rule: "Pagamentos só pelo ARO (Atlas Revenue Operations), depois da homologação E7 no EspelhoMeu, de políticas publicadas e de GO comercial. Até lá: registar interesse e informar que as condições serão enviadas na abertura.",
    },
    offers: [
      {
        code: "CLUB",
        name: "Club Atlas — comunidade gratuita",
        owner: "Club Atlas",
        status: "pre_lancamento",
        price: price.club,
        url: club,
        whatsappUrl: campaignWhatsAppUrl("CLUB"),
        audience: "Estudantes de todas as áreas, iniciantes, criadores e pequenos empreendedores. Não é preciso saber programar.",
        facts: [
          "Comunidade gratuita, sem compra obrigatória.",
          "Cadastro de membros em preparação: ainda não abriu.",
          "Separado do Genesis (pago) e dos workshops empresariais da AtlasHub.SI.",
        ],
        nextStep: "Apresentar o Club e registar interesse (com consentimento) para avisar quando o cadastro abrir.",
        signup: { open: false, futureUrl: `${club}/participar` },
      },
      {
        code: "GEN-EA",
        name: "Genesis Turma 01 + Early Access",
        owner: "Club Atlas",
        status: "interesse_aberto_matricula_fechada",
        price: { standard: price.genesisStandard, student: price.genesisStudent, notes: [priceNotes.student, priceNotes.noCharge, priceNotes.noInstallments] },
        url: `${club}/genesis#early-access`,
        whatsappUrl: campaignWhatsAppUrl("GEN-EA"),
        facts: [
          `Início previsto: ${genesisFacts.start}; ${genesisFacts.weeks} semanas; ${genesisFacts.ateliers} ateliers; ${genesisFacts.format}.`,
          `Early Access: quem registrar interesse até ${earlyAccess.deadline} recebe ${earlyAccess.benefit}`,
          earlyAccess.fine,
          "A oferta padrão não exige condição de estudante; a de estudante exige validação antes de qualquer pagamento.",
        ],
        earlyAccessAteliers: earlyAccessAteliers.map((a) => ({ title: a.title, format: a.format })),
        decemberDates: "não definidas",
        nextStep: "Registar o interesse no CRM com data e código (prova do prazo de 30/11) e, se pedido, a intenção de validar a condição de estudante.",
        aro: { project: "atlas-club", offers: ["genesis-01-br", "genesis-01-student-br"], status: "draft" },
      },
      {
        code: "W01",
        name: "Workshop 01 — Empresa Aumentada 2027–2030",
        owner: "AtlasHub.SI",
        status: "pre_lancamento",
        price: "a confirmar na abertura das inscrições",
        url: `${si}/workshops/empresa-aumentada-2027-2030`,
        date: "14/11/2026, 14h–17h (Brasília) + Clínica de Ideias online em 16/11, 16h–18h",
        city: "Anápolis/GO",
        venue: "a divulgar",
        audience: "Decisores de PME, sócios, gestores e responsáveis operacionais.",
        nextStep: "Registar pedido de participação ou lista de espera (com consentimento) para receber a abertura das inscrições.",
        aro: { project: "atlashub-si", offers: ["workshop-01-empresa-aumentada-antecipado-br", "workshop-01-empresa-aumentada-regular-br"], status: "draft" },
      },
      {
        code: "EL01",
        name: "Enterprise Lab 01 — E-commerce e Operações Vivas",
        owner: "AtlasHub.SI",
        status: "pre_lancamento",
        price: "a confirmar na abertura das inscrições (inscrição por empresa, 1 representante)",
        url: `${si}/workshops/enterprise-lab-ecommerce`,
        date: "28/11/2026, 14h–19h (Brasília)",
        city: "Anápolis/GO",
        venue: "a divulgar",
        audience: "Sellers de Mercado Livre, Shopee e loja própria; gestores de e-commerce, operações e logística.",
        nextStep: "Registar pedido de participação da empresa ou lista de espera (com consentimento).",
        aro: { project: "atlashub-si", offers: ["enterprise-lab-01-ecommerce-antecipado-br", "enterprise-lab-01-ecommerce-regular-br"], status: "draft" },
      },
    ],
    guardrails: catalogGuardrails,
    crm: {
      fields: ["data/hora do primeiro contacto", "código de campanha", "oferta de interesse", "nome", "telefone (o do próprio WhatsApp)", "cidade", "maior de 18 (sim/não)", "próximo passo"],
      consents: ["contacto sobre esta oferta (obrigatório para seguir)", "marketing de outras ofertas (facultativo, separado)", "grupo de WhatsApp (facultativo, separado)"],
      dedupe: "Um lead por telefone; acrescentar ofertas e códigos ao mesmo lead em vez de criar duplicados.",
    },
  };
}
