import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, Star } from 'lucide-react'
import { DEPOIMENTOS, DEPOIMENTOS_VISIVEIS, GOOGLE_REVIEW_URL } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { SectionHeading } from './SectionHeading'

/* ==========================================================================
   SEÇÃO: O QUE NOSSOS CLIENTES DIZEM (CARROSSEL ULTRA TECH)
   - Visível conforme DEPOIMENTOS_VISIVEIS = true.
   - Textos fornecidos pelos próprios clientes. Manter o original rigoroso.
   - 4 visíveis em fileira no desktop, deslize lateral suave, swipe mobile fluido.
   - Autoplay pausável (hover / touch / botão pause), retoma suavemente.
   - Círculo neutro com inicial da empresa (sem fotos de terceiros).
   - Estrelas em gold (apenas a quantidade de "nota", nunca quando nota for null).
   - Sem logo, cor ou marca Google junto aos depoimentos.
   ========================================================================== */

function getInitials(name: string): string {
  if (!name) return ''
  const trimmed = name.trim()
  return trimmed.charAt(0).toUpperCase()
}

export function TestimonialsSection() {
  const reduced = useReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(4)
  const sliderRef = useRef<HTMLDivElement>(null)
  const touchStartXRef = useRef(0)
  const touchEndXRef = useRef(0)

  // Filtrar rigorosamente: autorizado === true e texto preenchido
  const testimonials = DEPOIMENTOS.filter(
    (item) => item.autorizado && item.texto && item.texto.trim().length > 0,
  )

  // Ajuste do número de cards visíveis por breakpoint
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth
      if (width >= 1200) {
        setCardsPerView(4)
      } else if (width >= 900) {
        setCardsPerView(3)
      } else if (width >= 600) {
        setCardsPerView(2)
      } else {
        setCardsPerView(1)
      }
    }

    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  const maxIndex = Math.max(0, testimonials.length - cardsPerView)

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  // Autoplay fluido com pausa em hover ou interação
  useEffect(() => {
    if (reduced || isPaused || maxIndex === 0) return
    const interval = window.setInterval(() => {
      goNext()
    }, 4200)
    return () => window.clearInterval(interval)
  }, [reduced, isPaused, maxIndex, goNext])

  // Suporte a swipe nativo por toque
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goNext()
        trackEvent('depoimentos_navegacao', { direcao: 'proximo', tipo: 'swipe' })
      } else {
        goPrev()
        trackEvent('depoimentos_navegacao', { direcao: 'anterior', tipo: 'swipe' })
      }
    }
    // Retoma autoplay após 4 segundos sem tocar
    window.setTimeout(() => setIsPaused(false), 4000)
  }

  const stepPercent = 100 / cardsPerView
  const offsetPercent = currentIndex * stepPercent

  if (!DEPOIMENTOS_VISIVEIS || testimonials.length === 0) return null

  return (
    <section className="section testimonials-section" aria-labelledby="testimonials-title">
      <div className="shell">
        <div className="testimonials-header-bar">
          <SectionHeading
            eyebrow="Depoimentos"
            title="O que nossos clientes dizem"
            description="Avaliações de clientes que confiaram na Nozes Ink."
          />

          <div className="testimonials-carousel-controls" aria-label="Controles do carrossel">
            {!reduced && (
              <button
                type="button"
                className="testimonials-control-btn pause-toggle"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={
                  isPaused ? 'Retomar reprodução automática' : 'Pausar reprodução automática'
                }
                title={isPaused ? 'Retomar' : 'Pausar'}
              >
                {isPaused ? (
                  <Play size={14} aria-hidden="true" />
                ) : (
                  <Pause size={14} aria-hidden="true" />
                )}
              </button>
            )}
            <button
              type="button"
              className="testimonials-control-btn prev"
              onClick={() => {
                goPrev()
                trackEvent('depoimentos_navegacao', { direcao: 'anterior', tipo: 'botao' })
              }}
              aria-label="Depoimento anterior"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="testimonials-control-btn next"
              onClick={() => {
                goNext()
                trackEvent('depoimentos_navegacao', { direcao: 'proximo', tipo: 'botao' })
              }}
              aria-label="Próximo depoimento"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* CONTAINER DO CARROSSEL ULTRA TECH */}
        <div
          className="testimonials-carousel-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={sliderRef}
          aria-roledescription="carousel"
          aria-live={isPaused ? 'polite' : 'off'}
        >
          <div
            className="testimonials-track"
            style={{
              transform: `translate3d(-${offsetPercent}%, 0, 0)`,
            }}
          >
            {testimonials.map((item, index) => {
              const initial = getInitials(item.empresa)
              const rating =
                typeof item.nota === 'number' && item.nota > 0 ? Math.min(item.nota, 5) : 0

              // Determina se o card está na visão ativa
              const isVisibleInWindow = index >= currentIndex && index < currentIndex + cardsPerView
              const isFirstInWindow = index === currentIndex
              return (
                <div
                  key={`${item.empresa}-${index}`}
                  className={`testimonial-slide ${isVisibleInWindow ? 'is-in-view' : 'is-off-view'} ${isFirstInWindow ? 'is-spotlight' : ''}`}
                  style={{ flex: `0 0 ${stepPercent}%`, maxWidth: `${stepPercent}%` }}
                >
                  <article className="testimonial-card">
                    <div className="testimonial-card-top-glow" aria-hidden="true" />
                    <div className="testimonial-card-shimmer" aria-hidden="true" />
                    <div className="testimonial-header">
                      <div className="testimonial-avatar" aria-hidden="true">
                        <span>{initial}</span>
                        <div className="testimonial-avatar-ring" />
                      </div>
                      <div className="testimonial-meta">
                        <h3 className="testimonial-company">{item.empresa}</h3>
                        {item.nome && <span className="testimonial-author">{item.nome}</span>}
                        {item.cargo && <span className="testimonial-role">{item.cargo}</span>}
                        {item.cidade && <span className="testimonial-city">{item.cidade}</span>}
                      </div>
                    </div>

                    {rating > 0 && (
                      <div
                        className="testimonial-stars"
                        aria-label={`Nota: ${rating} de 5 estrelas`}
                      >
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="star-icon"
                            fill="var(--gold)"
                            stroke="var(--gold)"
                            aria-hidden="true"
                          />
                        ))}
                        <span className="stars-badge">5.0</span>
                      </div>
                    )}

                    <blockquote className="testimonial-text">
                      <p>“{item.texto}”</p>
                    </blockquote>

                    {item.data && (
                      <time className="testimonial-date" dateTime={item.data}>
                        {item.data}
                      </time>
                    )}
                  </article>
                </div>
              )
            })}
          </div>
        </div>

        {/* Indicadores em barras no fundo do carrossel */}
        <div className="testimonials-dots" aria-label="Indicadores de página">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`testimonial-dot ${idx === currentIndex ? 'is-active' : ''}`}
              onClick={() => {
                setCurrentIndex(idx)
                trackEvent('depoimentos_navegacao', { indice: idx, tipo: 'dot' })
              }}
              aria-label={`Ir para posição ${idx + 1}`}
            />
          ))}
        </div>

        {/* Botão "Avalie no Google" somente quando GOOGLE_REVIEW_URL estiver preenchida */}
        {GOOGLE_REVIEW_URL && GOOGLE_REVIEW_URL.trim().length > 0 && (
          <div className="testimonials-action">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noreferrer"
              className="google-review-btn"
              onClick={() => trackEvent('clique_avalie_google')}
            >
              Avalie no Google
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
