import { useState, useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BriefcaseBusiness,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Dog,
  HelpCircle,
  House,
  PanelsTopLeft,
  Scissors,
  ShoppingBag,
  Stethoscope,
} from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/* ==========================================================================
   SEÇÃO PARA QUEM É (REFINADA)
   - Título: "Para negócios que vendem pelo WhatsApp, pelo Google e pelo catálogo."
   - 9 segmentos completos:
     1. Móveis planejados
     2. Esquadrias e serviços residenciais
     3. Automotivo
     4. Varejo local
     5. Serviços profissionais
     6. Barbearias e salões
     7. Clínicas e consultórios
     8. Pet shops
     9. Restaurantes e cafeterias
   - Animação em cascata dos ícones e frases com destaque sequencial suave.
   - Grid moderno, clean e refinado que não estoura em 360px.
   ========================================================================== */

interface SegmentItem {
  titulo: string
  descricao: string
  icon: LucideIcon
  tag: string
}

const AUDIENCE_SEGMENTS: SegmentItem[] = [
  {
    titulo: 'Móveis planejados',
    descricao: 'Projetos, medidas e orçamentos organizados sem perda de contexto.',
    icon: PanelsTopLeft,
    tag: 'Design & Marcenaria',
  },
  {
    titulo: 'Esquadrias e reformas',
    descricao: 'Solicitações de clientes e especificações encaminhadas com rapidez.',
    icon: House,
    tag: 'Serviços residenciais',
  },
  {
    titulo: 'Automotivo',
    descricao: 'Atendimentos, agendamento de serviços e dúvidas com fluxo ágil.',
    icon: CarFront,
    tag: 'Oficinas & Estética',
  },
  {
    titulo: 'Barbearias e salões',
    descricao: 'Horários marcados sem demora no WhatsApp e agenda sempre cheia.',
    icon: Scissors,
    tag: 'Beleza & Estilo',
  },
  {
    titulo: 'Clínicas e consultórios',
    descricao: 'Triagem educada, confirmação prévia e redução drástica de faltas.',
    icon: Stethoscope,
    tag: 'Saúde & Bem-estar',
  },
  {
    titulo: 'Pet shops e veterinárias',
    descricao: 'Banho, tosa e consultas agendados em segundos pelo celular.',
    icon: Dog,
    tag: 'Cuidado animal',
  },
  {
    titulo: 'Restaurantes e cafés',
    descricao: 'Cardápio digital ágil, reservas e pedidos direto pelo WhatsApp.',
    icon: Coffee,
    tag: 'Gastronomia',
  },
  {
    titulo: 'Varejo local',
    descricao: 'Catálogo de produtos sempre visível e fácil de consultar no chat.',
    icon: ShoppingBag,
    tag: 'Comércio & Lojas',
  },
  {
    titulo: 'Serviços profissionais',
    descricao: 'Agenda conectada, presença no Google e captação de contatos qualificados.',
    icon: BriefcaseBusiness,
    tag: 'Consultoria & Perícia',
  },
]

export function AudienceSection() {
  const reduced = useReducedMotion()
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Dispara animação e tracking de visibilidade
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting)
        })
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Destaque sequencial contínuo e suave (ritmo de 2,2s por segmento)
  useEffect(() => {
    if (reduced || !isInView) return
    let lastTick = performance.now()
    let frameId: number

    const tick = (now: number) => {
      if (now - lastTick >= 2200) {
        lastTick = now
        setHighlightedIndex((prev) => (prev + 1) % AUDIENCE_SEGMENTS.length)
      }
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [reduced, isInView])

  // Controles do carrossel mobile
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartXRef = useRef(0)
  const touchEndXRef = useRef(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % AUDIENCE_SEGMENTS.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + AUDIENCE_SEGMENTS.length) % AUDIENCE_SEGMENTS.length)
  }

  // Autoplay suave no mobile com pausa no toque
  useEffect(() => {
    if (reduced || isPaused || !isInView) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AUDIENCE_SEGMENTS.length)
    }, 3800)
    return () => clearInterval(timer)
  }, [reduced, isPaused, isInView])

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    touchStartXRef.current = e.touches[0].clientX
    touchEndXRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
    window.setTimeout(() => setIsPaused(false), 3500)
  }

  return (
    <section
      ref={sectionRef}
      className="audience-section"
      aria-labelledby="audience-title"
      data-audience
    >
      <div className="shell">
        <div className="audience-heading" data-reveal>
          <div>
            <p className="eyebrow">Para quem é</p>
            <h2 id="audience-title">
              Para negócios que vendem pelo WhatsApp, pelo Google e pelo catálogo.
            </h2>
          </div>
          <p className="audience-intro-text">
            Não importa se você vende um projeto de alto padrão, um atendimento de beleza ou uma
            refeição artesanal: onde existe um contato interessado e um atendente ocupado, a Nozes
            Ink elimina a fricção.
          </p>
        </div>

        {/* Visualização responsiva: Carrossel com swipe no mobile (<= 768px) e Grid limpo no desktop */}
        <div
          className="audience-carousel-mobile-wrapper"
          aria-label="Segmentos atendidos no celular"
        >
          <div
            className="audience-carousel-track"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ transform: `translate3d(-${currentIndex * 100}%, 0, 0)` }}
          >
            {AUDIENCE_SEGMENTS.map((segment, index) => {
              const Icon = segment.icon || HelpCircle
              const titulo = segment.titulo || 'Segmento'
              const descricao = segment.descricao || ''
              const isCurrent = index === currentIndex

              return (
                <div className="audience-mobile-slide" key={titulo}>
                  <article className={`audience-card ${isCurrent ? 'is-highlighted' : ''}`}>
                    <div className="audience-card-top">
                      <div className="audience-icon-wrap" aria-hidden="true">
                        <Icon size={22} />
                      </div>
                      <span className="audience-card-tag">{segment.tag}</span>
                    </div>
                    <h3>{titulo}</h3>
                    <p>{descricao}</p>
                    <div className="audience-card-indicator" aria-hidden="true">
                      <span />
                    </div>
                  </article>
                </div>
              )
            })}
          </div>

          {/* Controles e Indicadores de página mobile com alvos de 44px */}
          <div className="audience-mobile-controls">
            <button
              type="button"
              className="audience-control-btn"
              onClick={prevSlide}
              aria-label="Segmento anterior"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <div className="audience-dots" aria-label="Indicadores dos segmentos">
              {AUDIENCE_SEGMENTS.map((seg, idx) => (
                <button
                  key={seg.titulo}
                  type="button"
                  className={`audience-dot ${idx === currentIndex ? 'is-active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Ir para segmento ${idx + 1}: ${seg.titulo}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="audience-control-btn"
              onClick={nextSlide}
              aria-label="Próximo segmento"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Grade tradicional no Desktop */}
        <div
          className="audience-grid desktop-only-grid"
          tabIndex={0}
          aria-label="Segmentos atendidos pela Nozes Ink"
        >
          {AUDIENCE_SEGMENTS.map((segment, index) => {
            const Icon = segment.icon || HelpCircle
            const titulo = segment.titulo || 'Segmento'
            const descricao = segment.descricao || ''
            const isHighlighted = !reduced && index === highlightedIndex

            return (
              <article
                key={titulo}
                className={`audience-card ${isHighlighted ? 'is-highlighted' : ''}`}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="audience-card-top">
                  <div className="audience-icon-wrap" aria-hidden="true">
                    <Icon size={22} />
                  </div>
                  <span className="audience-card-tag">{segment.tag}</span>
                </div>
                <h3>{titulo}</h3>
                <p>{descricao}</p>
                <div className="audience-card-indicator" aria-hidden="true">
                  <span />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
