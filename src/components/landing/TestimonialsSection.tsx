import { Star } from 'lucide-react'
import { DEPOIMENTOS, DEPOIMENTOS_VISIVEIS, GOOGLE_REVIEW_URL } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'
import { SectionHeading } from './SectionHeading'

/* ==========================================================================
   SEÇÃO: O QUE NOSSOS CLIENTES DIZEM
   - Visível conforme DEPOIMENTOS_VISIVEIS = true.
   - Textos fornecidos pelos próprios clientes. Manter o original e os registros
     de autorização e de nota.
   - Círculo neutro com inicial da empresa (sem foto de perfil).
   - Estrelas em gold (apenas a quantidade de "nota", nunca quando nota for null).
   - Sem logo, cor ou identidade visual do Google junto aos depoimentos.
   - Botão "Avalie no Google" aparece somente quando GOOGLE_REVIEW_URL estiver preenchida.
   ========================================================================== */

function getInitials(name: string): string {
  if (!name) return ''
  const trimmed = name.trim()
  return trimmed.charAt(0).toUpperCase()
}

export function TestimonialsSection() {
  if (!DEPOIMENTOS_VISIVEIS) return null

  // Filtrar rigorosamente: autorizado === true e texto preenchido
  const testimonials = DEPOIMENTOS.filter(
    (item) => item.autorizado && item.texto && item.texto.trim().length > 0,
  )

  if (testimonials.length === 0) return null

  return (
    <section className="section testimonials-section" aria-labelledby="testimonials-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Depoimentos"
          title="O que nossos clientes dizem"
          description="Avaliações de clientes que trabalharam com a Nozes Ink."
        />

        <div className="testimonials-grid">
          {testimonials.map((item, index) => {
            const initial = getInitials(item.empresa)
            const rating =
              typeof item.nota === 'number' && item.nota > 0 ? Math.min(item.nota, 5) : 0

            return (
              <article key={`${item.empresa}-${index}`} className="testimonial-card" data-reveal>
                <div className="testimonial-header">
                  <div className="testimonial-avatar" aria-hidden="true">
                    <span>{initial}</span>
                  </div>
                  <div className="testimonial-meta">
                    <h3 className="testimonial-company">{item.empresa}</h3>
                    {item.nome && <span className="testimonial-author">{item.nome}</span>}
                    {item.cargo && <span className="testimonial-role">{item.cargo}</span>}
                    {item.cidade && <span className="testimonial-city">{item.cidade}</span>}
                  </div>
                </div>

                {rating > 0 && (
                  <div className="testimonial-stars" aria-label={`Nota: ${rating} de 5 estrelas`}>
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="star-icon"
                        fill="var(--gold)"
                        stroke="var(--gold)"
                        aria-hidden="true"
                      />
                    ))}
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
            )
          })}
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
