export const navigation = [
  { href: "/", label: "Club Atlas" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/eventos", label: "Eventos" },
  { href: "/mentores", label: "Mentores" },
  { href: "/genesis", label: "Genesis" },
  { href: "/area-membro", label: "Área de membros" },
] as const;

export type CardItem = { title:string; detail:string; tag:string; href?:string; status?:string };
export const pillars: CardItem[] = [
  { title:"Aprender na prática",detail:"Fóruns abertos, encontros e pequenas experiências desde o primeiro dia.",tag:"COMUNIDADE" },
  { title:"O teu agente",detail:"Entende como criar identidade, memória, ferramentas e rotinas supervisionadas.",tag:"ATLAS LAB" },
  { title:"Projetos reais",detail:"Experimenta individualmente ou constrói em equipa, com respeito pela autoria.",tag:"BUILDS" },
  { title:"Mentoria humana + SI",detail:"Sérgio e as personagens digitais Atlas, Clara, Caio e Bia.",tag:"PESSOAS" },
];
export const mentors = [
 {name:"Sérgio Monteiro",role:"Mentor humano",description:"Estratégia, experiência empresarial, desafios e ligação ao mundo real.",type:"HUMANO",monogram:"SM"},
 {name:"Atlas",role:"Co-mentor SI · Engenheiro-chefe criativo",description:"Triângulo vivo que propõe experiências e ajuda a coordenar o que construímos.",type:"DIGITAL",monogram:"A"},
 {name:"Clara",role:"Mentora de comunidade",description:"Acolhimento, organização, percursos e apoio ao primeiro passo.",type:"DIGITAL",monogram:"C"},
 {name:"Caio",role:"Builder de projetos",description:"Explica, testa e transforma ideias em pequenos protótipos.",type:"DIGITAL",monogram:"C"},
 {name:"Bia",role:"Exploradora",description:"A perspectiva de quem está a começar: perguntas, curiosidade e experimentação.",type:"DIGITAL",monogram:"B"},
] as const;
export const events = [
 {date:"NOV • 2026", title:"Fóruns Abertos do Club",detail:"Três noites por semana: ideias, agentes e projetos; horário final por confirmar.",format:"ONLINE",state:"EM PREPARAÇÃO"},
 {date:"14 NOV",title:"Empresa Aumentada 2027–2030",detail:"Anápolis · Sábado, 14h–17h.",format:"PRESENCIAL",state:"PREVISTO"},
 {date:"16 NOV",title:"Clínica de Ideias",detail:"Segunda-feira, 16h–18h; complemento do workshop empresarial.",format:"ONLINE",state:"PREVISTO"},
 {date:"28 NOV",title:"E-commerce e Operações Vivas",detail:"Enterprise Lab em Anápolis · Sábado, 14h–19h.",format:"PRESENCIAL",state:"PREVISTO"},
 {date:"DEZ • 2026",title:"Estreia oficial do Club Atlas",detail:"Comunidade ativa e primeiras experiências de laboratório.",format:"HÍBRIDO",state:"EM PREPARAÇÃO"},
 {date:"09 JAN 2027",title:"Genesis — Turma 01",detail:"Abertura semipresencial Anápolis + online; oito semanas e 24 ateliers.",format:"HÍBRIDO",state:"PRÉ-CANDIDATURA"},
];
export const library = [
 {title:"Empresa Aumentada",category:"ATLAS EDITIONS",description:"Fundamentos da transformação empresarial e do futuro das operações.",access:"REFERÊNCIA EDITORIAL",status:"EDITORIAL EM PREPARAÇÃO"},
 {title:"O E-commerce Aumentado",category:"ATLAS EDITIONS",description:"O comércio digital como uma operação integrada entre pessoas, dados e sistemas.",access:"REFERÊNCIA EDITORIAL",status:"PREVIEW EDITORIAL"},
 {title:"O teu primeiro agente",category:"CLUB ATLAS",description:"Guia introdutório: contexto, objetivos, limites e primeira experiência.",access:"FUTURO FREE",status:"CONTEÚDO A PRODUZIR"},
 {title:"Genesis: Da semente ao ecossistema",category:"ATLAS LAB",description:"Percurso progressivo de oito semanas e desafios colaborativos.",access:"TURMA GENESIS",status:"PROGRAMA EM PREPARAÇÃO"},
];
