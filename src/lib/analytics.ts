type AnalyticsValue = string | number | boolean | undefined

declare global {
  interface Window {
    dataLayer?: Array<Record<string, AnalyticsValue>>
  }
}

// PONTO DE INSERÇÃO DE ANALYTICS: conecte aqui o gerenciador adotado pela Nozes Ink.
export function trackEvent(event: string, details: Record<string, AnalyticsValue> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...details })
}
