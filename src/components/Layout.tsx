import { ReactNode, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { DiagnosticCtaButton } from '@/components/DiagnosticCtaButton'
import { CONFIG, WHATSAPP_URL } from '@/lib/site'
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
            <p className="footer-label">Contato</p>
            <p>Joinville, SC</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('clique_whatsapp', { origem: 'rodape' })}
            >
              <MessageCircle size={18} aria-hidden="true" /> Conversar pelo WhatsApp
            </a>
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
