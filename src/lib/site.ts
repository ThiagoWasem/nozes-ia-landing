export type HeroVariant = 'A' | 'B'
export type FormVariant = 'curto' | 'etapas'

/* ==========================================================================
   CONSTANTES DE CONTROLE DO SITE
   - DEPOIMENTOS_VISIVEIS: true. Exibe a seção pois há 6 depoimentos autorizados pelos clientes.
   - CASOS_VISIVEIS: false. Seção de casos reais permanece oculta até haver material autorizado.
   - GOOGLE_REVIEW_URL: link de avaliação no Perfil da Empresa (Google Meu Negócio). Vazio oculta o botão.
   - MAPS_EMBED_URL: Iframe do Google Maps (compartilhar > incorporar mapa). Vazio não renderiza iframe.
   - AB_HERO: "A" | "B". Variante de teste do hero (título, CTA e visual).
   - FORM_AB: "curto" | "etapas". Formulário padrão é o curto; versão 3 etapas mantida para teste A/B.
   ========================================================================== */
export const DEPOIMENTOS_VISIVEIS = true
export const CASOS_VISIVEIS = false
export const GOOGLE_REVIEW_URL: string = ''
// Place ID oficial da Nozes Ink: ChIJOSAiDO623pQRNIFx22W5Ix4
export const MAPS_PLACE_ID = 'ChIJOSAiDO623pQRNIFx22W5Ix4'
export const MAPS_EMBED_URL: string = `https://maps.google.com/maps?q=Nozes+Ink%2C+Rua+Waldemiro+Jos%C3%A9+Borges%2C+3528%2C+Itinga%2C+Joinville+-+SC&t=m&z=15&output=embed`
export const AB_HERO: HeroVariant = 'A'
export const FORM_AB: FormVariant = 'curto'

/* ==========================================================================
   BANNER DE COOKIES (LGPD)
   - COOKIES_BANNER_ENABLED: false. O site HOJE não usa nenhum cookie de
     rastreamento (sem Analytics, sem Pixel, sem script de terceiros), então
     exibir banner seria desnecessário e apenas atrapalharia a conversão.
   - ATIVAR quando o primeiro rastreador for adicionado (ex.: Google Analytics
     4, Meta Pixel): basta mudar para true — o componente CookieBanner já está
     montado no Layout, pronto para capturar aceitar/recusar no localStorage.
   ========================================================================== */
export const COOKIES_BANNER_ENABLED = false

// Compatibilidade interna com referências anteriores
export const VARIANTE_HERO: HeroVariant = AB_HERO

export const HERO_COPY: Record<
  HeroVariant,
  {
    kicker: string
    title: string
    subtitle: string
    cta: string
    secondaryCta: string
    microproof: string
    visual: string
  }
> = {
  A: {
    kicker: 'DIAGNÓSTICO ANTES DA SOLUÇÃO',
    title:
      'Sua empresa tem um problema digital. Talvez você só ainda não tenha encontrado onde ele está.',
    subtitle:
      'Analisamos como sua empresa funciona, identificamos gargalos e implementamos soluções digitais.',
    cta: 'Solicitar meu diagnóstico',
    secondaryCta: 'Falar no WhatsApp',
    microproof: 'Diagnóstico gratuito. Sem compromisso.',
    visual: 'conversa',
  },
  B: {
    kicker: 'DIAGNÓSTICO ANTES DA SOLUÇÃO',
    title: 'Antes de escolher uma solução digital, descubra o que realmente trava sua empresa.',
    subtitle:
      'Analisamos como sua empresa funciona, identificamos gargalos e implementamos soluções digitais.',
    cta: 'Quero meu diagnóstico',
    secondaryCta: 'Falar no WhatsApp',
    microproof: 'Diagnóstico gratuito. Sem compromisso.',
    visual: 'processo',
  },
}

/* ==========================================================================
   DADOS OFICIAIS DA NOZES INK
   - WhatsApp: +55 47 8839-2501 (sem números de exemplo)
   - Redes oficiais com links diretos
   - Endereço em Joinville, SC
   ========================================================================== */
export const WHATSAPP_NUMERO = '554788392501'
export const WHATSAPP_MENSAGEM =
  'Olá! Vi o site da Nozes Ink e quero descobrir onde meu negócio está perdendo clientes no digital. Podem me ajudar com o diagnóstico gratuito?'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`

export const REDES_SOCIAIS = {
  instagram: 'https://www.instagram.com/nozesink/',
  facebook: 'https://www.facebook.com/profile.php?id=61595084103815&locale=pt_BR',
  tiktok: 'https://www.tiktok.com/@nozes.ink',
} as const

export const ENDERECO_RODAPE = 'Rua Waldemiro José Borges, 3528, Itinga, Joinville, SC'

export const CONFIG = {
  cliente_destaque: 'Casa Gramado Madeira LTDA',
  modo_funcionalidades: 'bento',
  demo_whatsapp_ativa: true,
  sticky_storytelling_ativo: true,
  casos_reais_ativos: CASOS_VISIVEIS,
  glow_cta: 'dourado',
  logo_animado: true,
} as const

/* ==========================================================================
   ESTRUTURA DE DEPOIMENTOS
   Textos fornecidos pelos próprios clientes. Manter o original e os registros
   de autorização e de nota. Nunca criar depoimento, nota, nome ou cargo.
   ========================================================================== */
export interface DepoimentoItem {
  empresa: string
  nome: string
  cargo: string
  cidade: string
  texto: string
  nota: number | null
  data: string
  autorizado: boolean
}

export const DEPOIMENTOS: DepoimentoItem[] = [
  {
    empresa: 'Casa Gramado Madeira LTDA',
    nome: '',
    cargo: '',
    cidade: '',
    texto:
      'Ótimo atendimento, equipe profissional e muito ágil. O trabalho ajudou a melhorar nossa presença no Google. Recomendo!',
    nota: 5,
    data: '',
    autorizado: true,
  },
  {
    empresa: 'AP! Café Retrô | Cafeteria e Doceria',
    nome: '',
    cargo: '',
    cidade: '',
    texto:
      'Gostei muito do atendimento, foram atenciosos, entenderam o que precisávamos e resolveram tudo com bastante agilidade.',
    nota: 5,
    data: '',
    autorizado: true,
  },
  {
    empresa: 'Faro Fino Pet Shop',
    nome: '',
    cargo: '',
    cidade: '',
    texto:
      'Gostamos bastante do catálogo e do site. Tudo foi feito de forma prática e organizada, facilitando a apresentação dos nossos produtos.',
    nota: 5,
    data: '',
    autorizado: true,
  },
  {
    empresa: 'Urban Salão de Beleza e Estética',
    nome: '',
    cargo: '',
    cidade: '',
    texto:
      'A integração da IA com os agendamentos facilitou bastante nossa rotina, principalmente nos horários mais movimentados. Muito bom!',
    nota: 5,
    data: '',
    autorizado: true,
  },
  {
    empresa: 'BOSS Barbearia',
    nome: '',
    cargo: '',
    cidade: '',
    texto:
      'O catálogo ficou do jeito que queríamos, tudo bem organizado e pensado para a nossa barbearia. Ficamos satisfeitos com o resultado.',
    nota: 5,
    data: '',
    autorizado: true,
  },
  {
    empresa: 'Adega Don Maximiliano',
    nome: '',
    cargo: '',
    cidade: '',
    texto:
      'Gostamos muito do site e da agilidade no atendimento. Pedimos alguns ajustes e fomos atendidos rapidamente. Recomendo!',
    nota: 5,
    data: '',
    autorizado: true,
  },
]

/* ==========================================================================
   ESTRUTURA DE CASOS REAIS
   Ocultos enquanto CASOS_VISIVEIS = false. Sem dados fictícios.
   ========================================================================== */
export const CASOS = [
  {
    area: 'Google Meu Negócio',
    cliente: 'Casa Gramado Madeira LTDA',
    metrica: { rotulo: '', valor: '' },
    texto: '',
    antes_depois: { antes: '', depois: '' },
    video: '',
    depoimento: { texto: '', autor: '', cargo: '' },
    autorizado: false,
  },
  {
    area: 'Novo site',
    cliente: 'Casa Gramado Madeira LTDA',
    metrica: { rotulo: '', valor: '' },
    texto: '',
    antes_depois: { antes: '', depois: '' },
    video: '',
    depoimento: { texto: '', autor: '', cargo: '' },
    autorizado: false,
  },
  {
    area: 'Conversão de vendas',
    cliente: 'Casa Gramado Madeira LTDA',
    metrica: { rotulo: '', valor: '' },
    texto: '',
    antes_depois: { antes: '', depois: '' },
    video: '',
    depoimento: { texto: '', autor: '', cargo: '' },
    autorizado: false,
  },
  {
    area: 'Crescimento de seguidores',
    cliente: 'Casa Gramado Madeira LTDA',
    metrica: { rotulo: '', valor: '' },
    texto: '',
    antes_depois: { antes: '', depois: '' },
    video: '',
    depoimento: { texto: '', autor: '', cargo: '' },
    autorizado: false,
  },
] as const

/* ==========================================================================
   SEGMENTOS E PROBLEMAS OFICIAIS
   ========================================================================== */
export const SEGMENTOS = [
  'Móveis planejados',
  'Esquadrias e serviços residenciais',
  'Automotivo',
  'Varejo local',
  'Serviços profissionais',
  'Outro',
] as const

export const PROBLEMAS = [
  {
    rotulo: 'Orçamento demora',
    apoio: 'Orçamentos lentos costumam significar vendas perdidas para quem responde antes.',
  },
  {
    rotulo: 'Catálogo desatualizado',
    apoio: 'Catálogo sem atualização constante faz o cliente buscar alternativas mais fáceis.',
  },
  {
    rotulo: 'Clientes perguntam sempre o mesmo',
    apoio: 'Perguntas repetitivas tomam tempo precioso que poderia ser dedicado ao fechamento.',
  },
  {
    rotulo: 'Não sou encontrado no Google',
    apoio: 'Sem presença no Google, concorrentes locais capturam clientes prontos para comprar.',
  },
  {
    rotulo: 'Não tenho site',
    apoio: 'A ausência de site próprio diminui a credibilidade e a conversão de novos contatos.',
  },
  {
    rotulo: 'Outro',
    apoio:
      'Identificar o gargalo específico é o primeiro passo para parar de perder oportunidades.',
  },
] as const
