export type HeroVariant = 'A' | 'B'

// PONTO DE TROCA DO TESTE A/B: altere somente entre "A" e "B".
export const VARIANTE_HERO: HeroVariant = 'A'

export const HERO_COPY: Record<HeroVariant, { title: string; cta: string; visual: string }> = {
  A: {
    title:
      'Sua empresa tem um problema digital. Talvez você só ainda não tenha encontrado onde ele está.',
    cta: 'Solicitar meu diagnóstico',
    visual: 'conversa',
  },
  B: {
    title: 'Antes de escolher uma solução digital, descubra o que realmente trava sua empresa.',
    cta: 'Quero meu diagnóstico',
    visual: 'processo',
  },
}

// PONTO DE TROCA: constante do WhatsApp atualizada com o número oficial da Nozes Ink (+55 47 8839-2501).
export const WHATSAPP_NUMERO = '554788392501'
export const WHATSAPP_MENSAGEM =
  'Olá! Vi o site da Nozes Ink e quero descobrir onde meu negócio está perdendo clientes no digital. Podem me ajudar com o diagnóstico gratuito?'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`

// REDES SOCIAIS OFICIAIS E ENDEREÇO DA NOZES INK
export const REDES_SOCIAIS = {
  instagram: 'https://www.instagram.com/nozesink/',
  facebook: 'https://www.facebook.com/profile.php?id=61595084103815&locale=pt_BR',
  tiktok: 'https://www.tiktok.com/@nozes.ink',
} as const

export const ENDERECO_RODAPE = 'Rua Waldemiro José Borges, 3528, Itinga, Joinville, SC'

// OBJETO CONFIG: controles centrais aprovados para a landing page.
export const CONFIG = {
  cliente_destaque: 'Casa Gramado Madeira LTDA',
  modo_funcionalidades: 'bento',
  demo_whatsapp_ativa: true,
  sticky_storytelling_ativo: true,
  casos_reais_ativos: true,
  glow_cta: 'dourado',
  logo_animado: true,
} as const

// OBJETO CASOS: substituir somente com dados reais e autorização expressa.
export const CASOS = [
  {
    area: 'Google Meu Negócio',
    cliente: 'Casa Gramado Madeira LTDA',
    metrica: { rotulo: '[preencher]', valor: '[preencher]' },
    texto: '[preencher]',
    antes_depois: { antes: '[foto]', depois: '[foto]' },
    video: '[url ou vazio]',
    depoimento: { texto: '[vazio]', autor: '[vazio]', cargo: '[vazio]' },
    autorizado: false,
  },
  {
    area: 'Novo site',
    cliente: 'Casa Gramado Madeira LTDA',
    metrica: { rotulo: '[preencher]', valor: '[preencher]' },
    texto: '[preencher]',
    antes_depois: { antes: '[print]', depois: '[print]' },
    video: '[url ou vazio]',
    depoimento: { texto: '[vazio]', autor: '[vazio]', cargo: '[vazio]' },
    autorizado: false,
  },
  {
    area: 'Conversão de vendas',
    cliente: 'Casa Gramado Madeira LTDA',
    metrica: { rotulo: '[preencher]', valor: '[preencher]' },
    texto: '[preencher]',
    antes_depois: { antes: '[print]', depois: '[print]' },
    video: '[url ou vazio]',
    depoimento: { texto: '[vazio]', autor: '[vazio]', cargo: '[vazio]' },
    autorizado: false,
  },
  {
    area: 'Crescimento de seguidores',
    cliente: 'Casa Gramado Madeira LTDA',
    metrica: { rotulo: '[preencher]', valor: '[preencher]' },
    texto: '[preencher]',
    antes_depois: { antes: '[print]', depois: '[print]' },
    video: '[url ou vazio]',
    depoimento: { texto: '[vazio]', autor: '[vazio]', cargo: '[vazio]' },
    autorizado: false,
  },
] as const

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
