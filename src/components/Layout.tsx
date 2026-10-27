import { ReactNode, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageCircle, MapPin } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { DiagnosticCtaButton } from '@/components/DiagnosticCtaButton'
import { CONFIG, WHATSAPP_URL, REDES_SOCIAIS, ENDERECO_RODAPE } from '@/lib/site'
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

  useEffect(() => {
    const update = () => setScrolled(pathname !== '/' || window.scrollY > window.innerHeight * 0.6)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname])

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

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-revealed'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [pathname])

  return (
    <div className="site-frame">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <div className="mobile-cta-strip">
        <button
          type="button"
          onClick={() => {
            trackEvent('clique_cta', { origem: 'topo_mobile' })
            scrollToDiagnostic()
          }}
        >
          Solicitar meu diagnóstico
        </button>
      </div>

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

      <footer className="site-footer" data-reveal>
        <div className="shell footer-grid">
          <div>
            <Logo variant="horizontal" tone="light" className="footer-logo" />
            <p className="footer-positioning">Soluções digitais orientadas por diagnóstico.</p>
          </div>
          <div className="footer-contact">
            <p className="footer-label">Contato e Localização</p>
            <p className="footer-address">
              <MapPin size={16} aria-hidden="true" className="inline-icon" />
              <span>{ENDERECO_RODAPE}</span>
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="footer-whatsapp-link"
              onClick={() => trackEvent('clique_whatsapp', { origem: 'rodape' })}
            >
              <MessageCircle size={18} aria-hidden="true" /> Conversar pelo WhatsApp
            </a>

            {/* REDES SOCIAIS OFICIAIS: Instagram, Facebook e TikTok seguindo diretrizes oficiais */}
            <div className="footer-social-section">
              <p className="footer-social-label">Redes sociais</p>
              <div className="footer-social-links">
                <a
                  href={REDES_SOCIAIS.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-link"
                  aria-label="Instagram da Nozes Ink"
                  onClick={() => trackEvent('clique_rede_social', { rede: 'instagram' })}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>Instagram</span>
                </a>
                <a
                  href={REDES_SOCIAIS.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-link"
                  aria-label="Facebook da Nozes Ink"
                  onClick={() => trackEvent('clique_rede_social', { rede: 'facebook' })}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </a>
                <a
                  href={REDES_SOCIAIS.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-link"
                  aria-label="TikTok da Nozes Ink"
                  onClick={() => trackEvent('clique_rede_social', { rede: 'tiktok' })}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.94-4.52V8.75a8.23 8.23 0 0 0 4.83 1.57V6.87a4.85 4.85 0 0 1-1-.18z" />
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-legal">
            <p className="footer-label">Privacidade</p>
            <Link to="/politica-de-privacidade">Política de privacidade</Link>
            <p>
              Usamos apenas cookies essenciais e, quando ativada, medição de uso sem identificar
              você diretamente.
            </p>
          </div>
        </div>
        <div className="shell footer-bottom">
          <p>© {new Date().getFullYear()} Nozes Ink. Joinville, Santa Catarina.</p>
        </div>
      </footer>
    </div>
  )
}
