import { ReactNode, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageCircle, MapPin, ExternalLink } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { DiagnosticCtaButton } from '@/components/DiagnosticCtaButton'
import {
  CONFIG,
  WHATSAPP_URL,
  REDES_SOCIAIS,
  ENDERECO_RODAPE,
  MAPS_EMBED_URL,
  MAPS_PLACE_ID,
} from '@/lib/site'
import { trackEvent } from '@/lib/analytics'

interface LayoutProps {
  children: ReactNode
}

function scrollToDiagnostic() {
  const target = document.getElementById('diagnostico')
  if (target) {
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  } else {
    window.location.href = '/#diagnostico'
  }
}

export function Layout({ children }: LayoutProps) {
  const { pathname, hash } = useLocation()
  const [scrolled, setScrolled] = useState(pathname !== '/')
  const [showMobileFixedBar, setShowMobileFixedBar] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [loadMap, setLoadMap] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Controle de scroll para o cabeçalho e para a barra fixa no mobile
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(pathname !== '/' || scrollY > 60)
      // Barra fixa mobile aparece após a primeira dobra (aproximadamente 60% da tela)
      setShowMobileFixedBar(pathname === '/' && scrollY > window.innerHeight * 0.6)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [pathname])

  // Esconder barra fixa do mobile quando algum campo de formulário estiver focado
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')
      ) {
        setIsInputFocused(true)
      }
    }

    const handleFocusOut = () => {
      setIsInputFocused(false)
    }

    window.addEventListener('focusin', handleFocusIn)
    window.addEventListener('focusout', handleFocusOut)
    return () => {
      window.removeEventListener('focusin', handleFocusIn)
      window.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  // Determina URL de embed com centralização em Joinville e na Nozes Ink:
  // Usa MAPS_EMBED_URL com fallback garantido de consulta no endereço oficial e Place ID
  const resolvedMapsEmbedUrl =
    MAPS_EMBED_URL && MAPS_EMBED_URL.trim().length > 0
      ? MAPS_EMBED_URL
      : `https://maps.google.com/maps?q=${encodeURIComponent(
          'Nozes Ink, ' + ENDERECO_RODAPE,
        )}&t=m&z=15&output=embed`

  // Lazy loading do iframe do mapa via IntersectionObserver
  useEffect(() => {
    if (!resolvedMapsEmbedUrl || !mapContainerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoadMap(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(mapContainerRef.current)
    return () => observer.disconnect()
  }, [resolvedMapsEmbedUrl])

  // Suporte a âncoras na URL
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    const frame = requestAnimationFrame(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  // Revelação de elementos com IntersectionObserver (threshold 0.15, rootMargin 0px 0px -10% 0px)
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || !('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('js-reveal')
      elements.forEach((element) => element.classList.add('is-revealed'))
      return
    }

    document.documentElement.classList.add('js-reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.classList.add('is-revealed')
      } else {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [pathname])

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    ENDERECO_RODAPE,
  )}`

  return (
    <div className="site-frame">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      {/* BARRA FIXA NO MOBILE: botões "Diagnóstico" e "WhatsApp", min-height 44px, oculta com input em foco */}
      <div
        className={`mobile-sticky-bar ${showMobileFixedBar && !isInputFocused ? 'is-visible' : ''}`}
        aria-label="Ações rápidas"
      >
        <button
          type="button"
          className="mobile-bar-btn diagnostic"
          onClick={() => {
            trackEvent('clique_cta', { origem: 'barra_fixa_mobile' })
            scrollToDiagnostic()
          }}
        >
          Diagnóstico
        </button>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="mobile-bar-btn whatsapp"
          onClick={() => trackEvent('clique_whatsapp', { origem: 'barra_fixa_mobile' })}
        >
          <MessageCircle size={16} aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Barra de progresso de leitura no topo fixo */}
      <div
        className="reading-progress-bar"
        aria-hidden="true"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="shell header-inner">
          <Link to="/" aria-label="Nozes Ink, página inicial" className="brand-link">
            <Logo
              variant="horizontal"
              tone="graphite"
              animated={CONFIG.logo_animado}
              className="desktop-logo"
            />
            <Logo
              variant="symbol"
              tone="evergreen"
              animated={CONFIG.logo_animado}
              className="mobile-logo"
            />
          </Link>
          <DiagnosticCtaButton
            source="cabecalho"
            className="header-cta"
            onClick={scrollToDiagnostic}
          />
        </div>
      </header>

      <div id="conteudo">{children}</div>

      {/* RODAPÉ OFICIAL: Redesign clean, profissional e refinado */}
      <footer className="site-footer" data-reveal>
        <div className="shell footer-top-accent" aria-hidden="true">
          <span className="accent-line" />
        </div>
        <div className="shell footer-grid-4">
          {/* Coluna 1: Marca e posicionamento */}
          <div className="footer-col col-brand">
            <Logo variant="horizontal" tone="light" className="footer-logo" />
            <p className="footer-positioning">Diagnóstico antes da solução.</p>
            <p className="footer-summary-tag">
              Inteligência de processo, IA prática e soluções digitais sob medida para negócios
              locais.
            </p>
          </div>

          {/* Coluna 2: Contato e Localização */}
          <div className="footer-col col-contact">
            <h3 className="footer-label">Contato e Localização</h3>
            <div className="footer-address-card">
              <MapPin size={18} aria-hidden="true" className="footer-pin-icon" />
              <div className="address-text">
                <strong>Joinville / SC</strong>
                <span>{ENDERECO_RODAPE}</span>
              </div>
            </div>
            <div className="footer-contact-actions">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-action-link whatsapp"
                onClick={() => trackEvent('clique_whatsapp', { origem: 'rodape' })}
              >
                <MessageCircle size={16} aria-hidden="true" /> Conversar no WhatsApp
              </a>
              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-action-link maps"
                onClick={() => trackEvent('clique_abrir_maps')}
              >
                <ExternalLink size={14} aria-hidden="true" /> Abrir no Google Maps
              </a>
            </div>
          </div>

          {/* Coluna 3: Redes sociais oficiais */}
          <div className="footer-col col-social">
            <h3 className="footer-label">Redes sociais</h3>
            <p className="footer-social-intro">
              Acompanhe novidades, bastidores e casos reais das nossas implementações.
            </p>
            <div className="footer-social-links">
              <a
                href={REDES_SOCIAIS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card-link"
                aria-label="Instagram oficial da Nozes Ink"
                onClick={() => trackEvent('clique_rede_social', { rede: 'instagram' })}
              >
                <div className="social-icon-box" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
                <div className="social-text">
                  <span className="social-name">Instagram</span>
                  <small className="social-handle">@nozesink</small>
                </div>
              </a>

              <a
                href={REDES_SOCIAIS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card-link"
                aria-label="Facebook oficial da Nozes Ink"
                onClick={() => trackEvent('clique_rede_social', { rede: 'facebook' })}
              >
                <div className="social-icon-box" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="social-text">
                  <span className="social-name">Facebook</span>
                  <small className="social-handle">Nozes Ink</small>
                </div>
              </a>

              <a
                href={REDES_SOCIAIS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card-link"
                aria-label="TikTok oficial da Nozes Ink"
                onClick={() => trackEvent('clique_rede_social', { rede: 'tiktok' })}
              >
                <div className="social-icon-box" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.94-4.52V8.75a8.23 8.23 0 0 0 4.83 1.57V6.87a4.85 4.85 0 0 1-1-.18z" />
                  </svg>
                </div>
                <div className="social-text">
                  <span className="social-name">TikTok</span>
                  <small className="social-handle">@nozesink</small>
                </div>
              </a>
            </div>
          </div>

          {/* Coluna 4: Mapa Google Maps (lazy via Place ID ChIJOSAiDO623pQRNIFx22W5Ix4) */}
          <div className="footer-col col-map" ref={mapContainerRef}>
            <div className="footer-map-header">
              <h3 className="footer-label">Localização no mapa</h3>
              <span className="map-badge">Joinville / SC</span>
            </div>
            {resolvedMapsEmbedUrl ? (
              loadMap ? (
                <div className="footer-map-wrapper">
                  <iframe
                    src={resolvedMapsEmbedUrl}
                    title="Localização oficial da Nozes Ink em Joinville, SC"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="footer-map-frame"
                  />
                </div>
              ) : (
                <div className="footer-map-skeleton">
                  <div className="skeleton-pulse" />
                  <span>Carregando mapa interativo...</span>
                </div>
              )
            ) : (
              <div className="footer-map-fallback">
                <p>{ENDERECO_RODAPE}</p>
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-action-link maps"
                >
                  <ExternalLink size={14} aria-hidden="true" /> Ver no Google Maps
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Barra inferior legal */}
        <div className="shell footer-bottom">
          <div className="footer-bottom-links">
            <Link to="/politica-de-privacidade">Política de privacidade</Link>
            <span className="sep" aria-hidden="true">
              •
            </span>
            <span>Cookies</span>
            <span className="sep" aria-hidden="true">
              •
            </span>
            <span>Termos de uso</span>
          </div>
          <p>© 2026 Nozes Ink. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
