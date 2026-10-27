import { ChangeEvent, FormEvent, useState } from 'react'
import {
  Check,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  PanelsTopLeft,
  House,
  CarFront,
  ShoppingBag,
  BriefcaseBusiness,
  HelpCircle,
  Clock,
  BookOpen,
  MessageSquareWarning,
  Search,
  Layout,
  AlertCircle,
} from 'lucide-react'
import { DiagnosticCtaButton } from '@/components/DiagnosticCtaButton'
import { createLead, getLeadFieldErrors, LeadFieldErrors } from '@/services/leads'
import { SEGMENTOS, PROBLEMAS, VARIANTE_HERO, WHATSAPP_URL } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'

// Ícones correspondentes a cada opção de segmento da etapa 1
const segmentoIcons: Record<
  string,
  React.ComponentType<{
    size?: number
    className?: string
    'aria-hidden'?: boolean | 'true' | 'false'
  }>
> = {
  'Móveis planejados': PanelsTopLeft,
  'Esquadrias e serviços residenciais': House,
  Automotivo: CarFront,
  'Varejo local': ShoppingBag,
  'Serviços profissionais': BriefcaseBusiness,
  Outro: HelpCircle,
}

// Ícones correspondentes a cada opção de problema da etapa 2
const problemaIcons: Record<
  string,
  React.ComponentType<{
    size?: number
    className?: string
    'aria-hidden'?: boolean | 'true' | 'false'
  }>
> = {
  'Orçamento demora': Clock,
  'Catálogo desatualizado': BookOpen,
  'Clientes perguntam sempre o mesmo': MessageSquareWarning,
  'Não sou encontrado no Google': Search,
  'Não tenho site': Layout,
  Outro: AlertCircle,
}

interface FormState {
  segmento: string
  problema: string
  nome: string
  empresa: string
  whatsapp: string
  consentimento_lgpd: boolean
}

const initial: FormState = {
  segmento: '',
  problema: '',
  nome: '',
  empresa: '',
  whatsapp: '',
  consentimento_lgpd: false,
}

export function DiagnosticForm() {
  /* =====================================================================
     LÓGICA DO FORMULÁRIO DE 3 ETAPAS
     Etapa 1: Seleção do segmento (cards clicáveis)
     Etapa 2: Seleção do problema (cards clicáveis + frase curta de apoio)
     Etapa 3: Dados de contato (nome, empresa, whatsapp, consentimento LGPD)
     ===================================================================== */
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<LeadFieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const selectedProblemaObj = PROBLEMAS.find((p) => p.rotulo === form.problema)

  const handleSelectSegmento = (segmento: string) => {
    setForm((current) => ({ ...current, segmento }))
    setErrors((current) => ({ ...current, segmento: undefined }))
    // PONTO DE ANALYTICS: seleção de segmento e avanço para etapa 2
    trackEvent('formulario_selecao_segmento', { segmento })
  }

  const handleSelectProblema = (problema: string) => {
    setForm((current) => ({ ...current, problema }))
    setErrors((current) => ({ ...current, problema: undefined }))
    // PONTO DE ANALYTICS: seleção de problema e visualização da frase de apoio
    trackEvent('formulario_selecao_problema', { problema })
  }

  const goToStep2 = () => {
    if (!form.segmento) {
      setErrors((prev) => ({ ...prev, segmento: 'Selecione o seu segmento para avançar.' }))
      return
    }
    setErrors({})
    setDirection('forward')
    setCurrentStep(2)
    // PONTO DE ANALYTICS: avanço de etapa 1 para 2
    trackEvent('formulario_avanco_etapa', { de: 1, para: 2, segmento: form.segmento })
  }

  const goToStep3 = () => {
    if (!form.problema) {
      setErrors((prev) => ({
        ...prev,
        problema: 'Selecione o problema que mais pesa hoje para avançar.',
      }))
      return
    }
    setErrors({})
    setDirection('forward')
    setCurrentStep(3)
    // PONTO DE ANALYTICS: avanço de etapa 2 para 3
    trackEvent('formulario_avanco_etapa', { de: 2, para: 3, problema: form.problema })
  }

  const goBackToStep1 = () => {
    setDirection('backward')
    setCurrentStep(1)
    trackEvent('formulario_recuo_etapa', { de: 2, para: 1 })
  }

  const goBackToStep2 = () => {
    setDirection('backward')
    setCurrentStep(2)
    trackEvent('formulario_recuo_etapa', { de: 3, para: 2 })
  }

  const update = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const nextValue = event.target.type === 'checkbox' ? event.target.checked : value
    setForm((current) => ({ ...current, [name]: nextValue }))
    setErrors((current) => ({ ...current, [name]: undefined, formulario: undefined }))
  }

  const validateStep3 = (): LeadFieldErrors => {
    const errs: LeadFieldErrors = {}
    const digits = form.whatsapp.replace(/\D/g, '')

    if (!form.nome.trim()) {
      errs.nome = 'Informe seu nome.'
    } else if (form.nome.trim().length > 120) {
      errs.nome = 'Use no máximo 120 caracteres.'
    }

    if (form.empresa.trim().length > 120) {
      errs.empresa = 'Use no máximo 120 caracteres.'
    }

    if (!/^\d{10,13}$/.test(digits)) {
      errs.whatsapp = 'Informe DDD e número. Exemplo: (47) 98839-2501.'
    }

    if (!form.consentimento_lgpd) {
      errs.consentimento_lgpd = 'Marque a caixa para concordar em receber contato.'
    }

    return errs
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const step3Errors = validateStep3()
    if (Object.keys(step3Errors).length > 0) {
      setErrors(step3Errors)
      // PONTO DE ANALYTICS: erro de validação
      trackEvent('envio_formulario', { resultado: 'erro_validacao' })
      const firstField = Object.keys(step3Errors)[0]
      document.getElementById(firstField)?.focus()
      return
    }

    setLoading(true)
    setErrors({})

    /* PONTO DE ENVIO AO POCKETBASE (collection leads existente):
       Registra segmento e problema (na origem 'formulario | problema: X')
       sem necessidade de criar novas migrações. */
    try {
      const origemDetalhada = form.problema
        ? `formulario | problema: ${form.problema}`
        : 'formulario'

      await createLead({
        nome: form.nome.trim(),
        empresa: form.empresa.trim() || undefined,
        whatsapp: form.whatsapp.trim(),
        segmento: form.segmento,
        consentimento_lgpd: true,
        origem: origemDetalhada,
        variante_hero: VARIANTE_HERO,
      })
      // PONTO DE ANALYTICS: envio confirmado com sucesso
      trackEvent('envio_formulario', {
        resultado: 'sucesso',
        variante: VARIANTE_HERO,
        segmento: form.segmento,
        problema: form.problema,
      })
      setSuccess(true)
    } catch (error) {
      setErrors(getLeadFieldErrors(error))
      // PONTO DE ANALYTICS: falha de envio mantendo os dados preenchidos
      trackEvent('envio_formulario', { resultado: 'erro_backend', variante: VARIANTE_HERO })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span>
          <Check size={30} aria-hidden="true" />
        </span>
        <h3>Recebido. Entraremos em contato pelo WhatsApp.</h3>
        <p>Suas informações já estão com a Nozes Ink.</p>
      </div>
    )
  }

  const progressPercent = currentStep === 1 ? 33.33 : currentStep === 2 ? 66.66 : 100

  return (
    <div className="step-form-container">
      {/* BARRA DE PROGRESSO DOURADA COM RÓTULOS */}
      <div className="step-progress-wrapper" aria-label="Progresso do formulário">
        <div className="step-progress-labels">
          <span
            className={`step-label-item ${currentStep === 1 ? 'is-active' : ''} ${currentStep > 1 ? 'is-done' : ''}`}
          >
            Etapa 1 de 3
          </span>
          <span
            className={`step-label-item ${currentStep === 2 ? 'is-active' : ''} ${currentStep > 2 ? 'is-done' : ''}`}
          >
            2 de 3
          </span>
          <span className={`step-label-item ${currentStep === 3 ? 'is-active' : ''}`}>3 de 3</span>
        </div>
        <div className="step-progress-track">
          <div
            className="step-progress-bar"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={3}
          />
        </div>
      </div>

      <div className={`step-content-slider direction-${direction}`}>
        {/* =================================================================
            ETAPA 1: "Qual é o seu segmento?" Cards clicáveis
            ================================================================= */}
        {currentStep === 1 && (
          <div className="step-slide step-1" key="step-1">
            <h3 className="step-question-title">Qual é o seu segmento?</h3>
            <p className="step-question-sub">
              Selecione o ramo de atuação para receber um diagnóstico sob medida:
            </p>

            <div className="step-cards-grid" role="radiogroup" aria-label="Segmento de atuação">
              {SEGMENTOS.map((seg) => {
                const Icon = segmentoIcons[seg] || HelpCircle
                const isSelected = form.segmento === seg
                return (
                  <button
                    key={seg}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`step-choice-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectSegmento(seg)}
                  >
                    <div className="step-card-icon">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <span className="step-card-label">{seg}</span>
                    <div className="step-card-check" aria-hidden="true">
                      {isSelected && <Check size={14} />}
                    </div>
                  </button>
                )
              })}
            </div>

            {errors.segmento && (
              <small className="field-error text-center mt-2" role="alert">
                {errors.segmento}
              </small>
            )}

            <div className="step-actions mt-6">
              <button
                type="button"
                className="step-btn-next"
                onClick={goToStep2}
                disabled={!form.segmento}
              >
                <span>Avançar para etapa 2</span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            ETAPA 2: "Qual problema pesa mais hoje?" Cards clicáveis + frase
            ================================================================= */}
        {currentStep === 2 && (
          <div className="step-slide step-2" key="step-2">
            <h3 className="step-question-title">Qual problema pesa mais hoje?</h3>
            <p className="step-question-sub">
              Escolha a dificuldade que mais trava sua operação digital:
            </p>

            <div
              className="step-cards-grid"
              role="radiogroup"
              aria-label="Problema que mais pesa hoje"
            >
              {PROBLEMAS.map((item) => {
                const Icon = problemaIcons[item.rotulo] || AlertCircle
                const isSelected = form.problema === item.rotulo
                return (
                  <button
                    key={item.rotulo}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`step-choice-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectProblema(item.rotulo)}
                  >
                    <div className="step-card-icon">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <span className="step-card-label">{item.rotulo}</span>
                    <div className="step-card-check" aria-hidden="true">
                      {isSelected && <Check size={14} />}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Frase curta de apoio após a escolha */}
            {selectedProblemaObj && (
              <div className="step-support-box" role="note">
                <span className="step-support-icon">💡</span>
                <p className="step-support-text">{selectedProblemaObj.apoio}</p>
              </div>
            )}

            {errors.problema && (
              <small className="field-error text-center mt-2" role="alert">
                {errors.problema}
              </small>
            )}

            <div className="step-nav-actions mt-6">
              <button type="button" className="step-btn-prev" onClick={goBackToStep1}>
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Voltar</span>
              </button>
              <button
                type="button"
                className="step-btn-next"
                onClick={goToStep3}
                disabled={!form.problema}
              >
                <span>Avançar para etapa 3</span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            ETAPA 3: Nome, empresa, WhatsApp, checkbox e envio
            ================================================================= */}
        {currentStep === 3 && (
          <form
            className="step-slide step-3 diagnostic-form"
            onSubmit={submit}
            noValidate
            key="step-3"
          >
            <h3 className="step-question-title">Onde enviamos o diagnóstico?</h3>
            <p className="step-question-sub">
              Preencha os dados de contato para a equipe da Nozes Ink falar com você:
            </p>

            <div className="step-summary-pills">
              <span className="step-pill">
                <strong>Segmento:</strong> {form.segmento}
              </span>
              <span className="step-pill">
                <strong>Foco:</strong> {form.problema}
              </span>
            </div>

            <div className="field-row">
              <label className="form-field" htmlFor="nome">
                <span>
                  Nome <b aria-hidden="true">*</b>
                </span>
                <input
                  id="nome"
                  name="nome"
                  autoComplete="name"
                  value={form.nome}
                  onChange={update}
                  aria-invalid={Boolean(errors.nome)}
                  aria-describedby={errors.nome ? 'nome-error' : undefined}
                  placeholder="Como podemos chamar você?"
                />
                {errors.nome && (
                  <small id="nome-error" className="field-error">
                    {errors.nome}
                  </small>
                )}
              </label>

              <label className="form-field" htmlFor="empresa">
                <span>Empresa</span>
                <input
                  id="empresa"
                  name="empresa"
                  autoComplete="organization"
                  value={form.empresa}
                  onChange={update}
                  aria-invalid={Boolean(errors.empresa)}
                  aria-describedby={errors.empresa ? 'empresa-error' : undefined}
                  placeholder="Nome da sua empresa"
                />
                {errors.empresa && (
                  <small id="empresa-error" className="field-error">
                    {errors.empresa}
                  </small>
                )}
              </label>
            </div>

            <div className="field-row single-row">
              <label className="form-field" htmlFor="whatsapp">
                <span>
                  WhatsApp <b aria-hidden="true">*</b>
                </span>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  autoComplete="tel"
                  value={form.whatsapp}
                  onChange={update}
                  aria-invalid={Boolean(errors.whatsapp)}
                  aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined}
                  placeholder="(47) 98839-2501"
                />
                {errors.whatsapp && (
                  <small id="whatsapp-error" className="field-error">
                    {errors.whatsapp}
                  </small>
                )}
              </label>
            </div>

            <label className="consent-field" htmlFor="consentimento_lgpd">
              <input
                id="consentimento_lgpd"
                name="consentimento_lgpd"
                type="checkbox"
                checked={form.consentimento_lgpd}
                onChange={update}
                aria-invalid={Boolean(errors.consentimento_lgpd)}
                aria-describedby={
                  errors.consentimento_lgpd ? 'consentimento_lgpd-error' : undefined
                }
              />
              <span aria-hidden="true">
                <Check size={14} />
              </span>
              <em>Concordo em receber contato sobre o diagnóstico</em>
            </label>
            {errors.consentimento_lgpd && (
              <small id="consentimento_lgpd-error" className="field-error checkbox-error">
                {errors.consentimento_lgpd}
              </small>
            )}

            {errors.formulario && (
              <div className="form-error" role="alert">
                {errors.formulario}
              </div>
            )}

            <div className="step-nav-actions mt-5">
              <button
                type="button"
                className="step-btn-prev"
                onClick={goBackToStep2}
                disabled={loading}
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Voltar</span>
              </button>
            </div>

            <div className="form-actions mt-3">
              <DiagnosticCtaButton type="submit" source="formulario_final" disabled={loading}>
                {loading ? 'Enviando...' : 'Solicitar meu diagnóstico'}
              </DiagnosticCtaButton>
              <a
                className="whatsapp-button light"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('clique_whatsapp', { origem: 'formulario_final' })}
              >
                <MessageCircle size={18} aria-hidden="true" /> Falar no WhatsApp
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
