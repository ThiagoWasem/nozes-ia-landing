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

// PONTO DE TROCA: substitua pelo número real da Nozes Ink, com DDI e DDD, sem símbolos.
export const WHATSAPP_NUMERO = '5547999999999'
export const WHATSAPP_MENSAGEM = 'Olá! Quero solicitar meu diagnóstico digital gratuito.'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`

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
] as const
