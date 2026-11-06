import { useEffect, useState } from 'react'
import { Cookie } from 'lucide-react'
import { Link } from 'react-router-dom'
import { COOKIES_BANNER_ENABLED } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'

/* ==========================================================================
   BANNER DE CONSENTIMENTO DE COOKIES (LGPD)
   - Pronto, mas DESATIVADO enquanto o site não tiver nenhum rastreador
     (veja COOKIES_BANNER_ENABLED em src/lib/site.ts).
   - Quando ativado: nenhum botão pré-marcado, recusa tão fácil quanto aceitar
     (dois botões do mesmo tamanho, lado a lado) e a escolha fica gravada em
     localStorage ("nozes_consentimento_cookies": "aceito" | "recusado"),
     sem gravar nada antes da escolha do visitante.
   ========================================================================== */

const STORAGE_CONSENT_KEY = 'nozes_consentimento_cookies'
export type CookieConsent = 'aceito' | 'recusado'

function readStoredConsent(): CookieConsent | null {
  try {
    const value = localStorage.getItem(STORAGE_CONSENT_KEY)
    return value === 'aceito' || value === 'recusado' ? value : null
  } catch {
    return null
  }
}

export function CookieBanner() {
  // Estado inicial resolvido após a montagem para não mexer no HTML inicial (SSR/hidratação)
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setConsent(readStoredConsent())
    setReady(true)
  }, [])

  const handleChoice = (choice: CookieConsent) => {
    try {
      localStorage.setItem(STORAGE_CONSENT_KEY, choice)
    } catch {
      // Ignora storage bloqueado: a escolha vale apenas para esta sessão
    }
    setConsent(choice)
    trackEvent('consentimento_cookies', { decisao: choice })
  }

  // Só renderiza com a constante ligada, após ler a escolha anterior,
  // e nunca quando o visitante já decidiu.
  if (!COOKIES_BANNER_ENABLED || !ready || consent !== null) return null

  return (
    <div
      className="cookies-banner"
      role="dialog"
      aria-modal="false"
      aria-label="Preferências de cookies"
    >
      <div className="cookies-banner-inner">
        <div className="cookies-banner-copy">
          <span className="cookies-banner-icon" aria-hidden="true">
            <Cookie size={18} />
          </span>
          <p>
            Usamos apenas cookies essenciais para o site funcionar. Se algum cookie de análise ou
            marketing for adicionado no futuro, avisaremos aqui antes de ativá-lo.
          </p>
        </div>
        <div className="cookies-banner-actions">
          <button
            type="button"
            className="cookies-banner-btn accept"
            onClick={() => handleChoice('aceito')}
          >
            Aceitar
          </button>
          <button
            type="button"
            className="cookies-banner-btn decline"
            onClick={() => handleChoice('recusado')}
          >
            Recusar
          </button>
          <Link to="/politica-de-privacidade" className="cookies-banner-link">
            Política de privacidade
          </Link>
        </div>
      </div>
    </div>
  )
}
