import { ChangeEvent, FormEvent, useRef, useState } from 'react'
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
  Loader2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { DiagnosticCtaButton } from '@/components/DiagnosticCtaButton'
import { createLead, getLeadFieldErrors, LeadFieldErrors } from '@/services/leads'
import { FORM_AB, PROBLEMAS, SEGMENTOS, VARIANTE_HERO, WHATSAPP_URL } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'

/* ==========================================================================
   ÍCONES E MAPEAMENTO
   ========================================================================== */
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

/* ==========================================================================
   MÁSCARA E FORMATAÇÃO DE WHATSAPP BRASIL (+55 (XX) XXXXX-XXXX)
   ========================================================================== */
export function formatWhatsApp(value: string): string {
  // Remove tudo que não for dígito
  let digits = value.replace(/\D/g, '')

  // Se o usuário digitou o prefixo 55, preserva ou ajusta
  if (digits.startsWith('55') && digits.length > 2) {
    digits = digits.slice(2)
  }

  // Limita a 11 dígitos (DDD + 9 dígitos)
  digits = digits.slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `+55 (${digits}`
  if (digits.length <= 6) return `+55 (${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export function validateWhatsAppDigits(raw: string): { valid: boolean; message?: string } {
  const digits = raw.replace(/\D/g, '')
  // Aceita com ou sem 55 inicial
  const phone = digits.startsWith('55') ? digits.slice(2) : digits

  if (phone.length < 10 || phone.length > 11) {
    return { valid: false, message: 'Informe DDD e número com 10 ou 11 dígitos.' }
  }

  const ddd = parseInt(phone.slice(0, 2), 10)
  // DDDs válidos no Brasil variam de 11 a 99 (exclui 0X e valores inexistentes)
  const validDdds = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43,
    44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77,
    79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
  ]

  if (!validDdds.includes(ddd)) {
    return { valid: false, message: 'DDD inválido. Exemplo para Joinville: 47.' }
  }

  return { valid: true }
}

/* ==========================================================================
   SEGURANÇA E HIGIENIZAÇÃO DE ENTRADAS (LGPD & Anti-Abuso)
   - sanitizeInput: remove caracteres de controle invisíveis, tags HTML e aplica trim
   - checkSessionRateLimit: impede spam limitando a 1 envio por sessão a cada 30 segundos
   - ZERO logs em console de dados pessoais do lead (privacidade garantida)
   ========================================================================== */
function sanitizeInput(value: string): string {
  if (!value) return ''
  return (
    value
      // Remove caracteres de controle mantendo texto legível e prevenindo injeções
      // oxlint-disable-next-line eslint(no-control-regex)
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      // Remove tags HTML para prevenir XSS armazenado
      .replace(/<[^>]*>?/gm, '')
      .trim()
  )
}

const RATE_LIMIT_STORAGE_KEY = 'nozes_ink_last_submit_time'
const RATE_LIMIT_COOLDOWN_MS = 30 * 1000 // 30 segundos de intervalo mínimo entre envios

function getRateLimitRemainingSeconds(): number {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY)
    if (!raw) return 0
    const lastTime = parseInt(raw, 10)
    const elapsed = Date.now() - lastTime
    if (elapsed < RATE_LIMIT_COOLDOWN_MS) {
      return Math.ceil((RATE_LIMIT_COOLDOWN_MS - elapsed) / 1000)
    }
  } catch {
    // sessionStorage indisponível (modo restrito ou sem permissão)
  }
  return 0
}

function recordSubmissionTimestamp(): void {
  try {
    sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, String(Date.now()))
  } catch {
    // Modo privado silencioso
  }
}

interface FormState {
  nome: string
  empresa: string
  whatsapp: string
  segmento: string
  problema: string
  consentimento_lgpd: boolean
  // Opcional e separado do LGPD: nunca pré-marcado e não bloqueia o envio.
  consentimento_marketing: boolean
  // Campo honeypot anti-spam (invisível para usuários, bots preenchem)
  website_trap: string
}

const initialState: FormState = {
  nome: '',
  empresa: '',
  whatsapp: '',
  segmento: '',
  problema: '',
  consentimento_lgpd: false,
  consentimento_marketing: false,
  website_trap: '',
}

/* ==========================================================================
   FORMULÁRIO CURTO (PADRÃO)
   Campos: Nome, Empresa, WhatsApp (+55 e validação de DDD), Segmento (select)
   Consentimento LGPD com link da política, honeypot anti-spam.
   ========================================================================== */
function ShortDiagnosticForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<LeadFieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const hasStartedRef = useRef(false)

  const handleFieldChange = (field: keyof FormState, value: string | boolean) => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      // PONTO DE ANALYTICS: início do preenchimento
      trackEvent('inicio_formulario', { tipo: 'curto' })
    }

    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, formulario: undefined }))
  }

  const validate = (): LeadFieldErrors => {
    const errs: LeadFieldErrors = {}

    if (!form.nome.trim()) {
      errs.nome = 'Informe seu nome.'
    } else if (form.nome.trim().length > 120) {
      errs.nome = 'Use no máximo 120 caracteres.'
    }

    if (!form.empresa.trim()) {
      errs.empresa = 'Informe o nome da sua empresa.'
    } else if (form.empresa.trim().length > 120) {
      errs.empresa = 'Use no máximo 120 caracteres.'
    }

    const phoneCheck = validateWhatsAppDigits(form.whatsapp)
    if (!phoneCheck.valid) {
      errs.whatsapp = phoneCheck.message || 'WhatsApp inválido.'
    }

    if (!form.segmento) {
      errs.segmento = 'Selecione o segmento da sua empresa.'
    }

    if (!form.consentimento_lgpd) {
      errs.consentimento_lgpd = 'Marque para concordar em receber contato sobre o diagnóstico.'
    }

    return errs
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    // 1. Verificação de honeypot anti-spam: se preenchido, rejeita silenciosamente
    if (form.website_trap && form.website_trap.trim().length > 0) {
      // Simula sucesso sem persistir nada (sem spam no banco)
      setSuccess(true)
      return
    }

    // 2. Rate limit simples por sessão: bloqueia reenvio em menos de 30 segundos
    const remainingCooldown = getRateLimitRemainingSeconds()
    if (remainingCooldown > 0) {
      setErrors({
        formulario: `Aguarde ${remainingCooldown} segundo${remainingCooldown > 1 ? 's' : ''} antes de enviar novamente.`,
      })
      return
    }

    // 3. Validação dos dados sanitizados
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // PONTO DE ANALYTICS: erro de validação (nenhum dado de lead é registrado no evento)
      trackEvent('envio_formulario', { resultado: 'erro_validacao', tipo: 'curto' })
      const firstKey = Object.keys(validationErrors)[0]
      document.getElementById(`short-${firstKey}`)?.focus()
      return
    }

    setLoading(true)
    setErrors({})
    trackEvent('envio_formulario', {
      resultado: 'iniciado',
      tipo: 'curto',
      variante: VARIANTE_HERO,
    })

    try {
      /* PONTO DE ENVIO AO BACKEND (coleção leads, via VITE_POCKETBASE_URL):
         Segurança: Entradas sanitizadas (trim, sem caracteres de controle e sem tags).
         Privacidade: Nenhum dado sensível do lead é emitido em console do navegador. */
      const cleanNome = sanitizeInput(form.nome)
      const cleanEmpresa = sanitizeInput(form.empresa)
      const cleanWhatsapp = sanitizeInput(form.whatsapp)
      const cleanSegmento = sanitizeInput(form.segmento)

      await createLead({
        nome: cleanNome,
        empresa: cleanEmpresa,
        whatsapp: cleanWhatsapp,
        segmento: cleanSegmento,
        consentimento_lgpd: true,
        // Aceite opcional de marketing: registrado apenas quando marcado
        ...(form.consentimento_marketing ? { consentimento_marketing: true } : {}),
        origem: 'formulario_curto',
        variante_hero: VARIANTE_HERO,
      })

      // Registra timestamp de envio para o rate limit da sessão
      recordSubmissionTimestamp()

      // PONTO DE ANALYTICS: envio concluído com sucesso (apenas metadados não-pessoais)
      trackEvent('envio_formulario', {
        resultado: 'sucesso',
        tipo: 'curto',
        variante: VARIANTE_HERO,
        segmento: cleanSegmento,
      })
      setSuccess(true)
    } catch (error) {
      // PONTO DE ANALYTICS: erro de envio
      trackEvent('envio_formulario', {
        resultado: 'erro_backend',
        tipo: 'curto',
        variante: VARIANTE_HERO,
      })
      setErrors(getLeadFieldErrors(error))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span aria-hidden="true">
          <Check size={32} />
        </span>
        <h3>Recebido. Entraremos em contato pelo WhatsApp.</h3>
        <p>Suas informações já estão com a equipe da Nozes Ink.</p>
      </div>
    )
  }

  return (
    <form className="diagnostic-form short-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot anti-spam invisível */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="short-website_trap">Não preencha este campo:</label>
        <input
          id="short-website_trap"
          name="website_trap"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website_trap}
          onChange={(e) => setForm((prev) => ({ ...prev, website_trap: e.target.value }))}
        />
      </div>

      <div className="field-row">
        <label className="form-field" htmlFor="short-nome">
          <span>
            Nome <b aria-hidden="true">*</b>
          </span>
          <input
            id="short-nome"
            name="nome"
            type="text"
            autoComplete="name"
            value={form.nome}
            onChange={(e) => handleFieldChange('nome', e.target.value)}
            aria-invalid={Boolean(errors.nome)}
            aria-describedby={errors.nome ? 'short-nome-error' : undefined}
            placeholder="Como podemos chamar você?"
            disabled={loading}
          />
          {errors.nome && (
            <small id="short-nome-error" className="field-error" role="alert">
              {errors.nome}
            </small>
          )}
        </label>

        <label className="form-field" htmlFor="short-empresa">
          <span>
            Empresa <b aria-hidden="true">*</b>
          </span>
          <input
            id="short-empresa"
            name="empresa"
            type="text"
            autoComplete="organization"
            value={form.empresa}
            onChange={(e) => handleFieldChange('empresa', e.target.value)}
            aria-invalid={Boolean(errors.empresa)}
            aria-describedby={errors.empresa ? 'short-empresa-error' : undefined}
            placeholder="Nome da sua empresa"
            disabled={loading}
          />
          {errors.empresa && (
            <small id="short-empresa-error" className="field-error" role="alert">
              {errors.empresa}
            </small>
          )}
        </label>
      </div>

      <div className="field-row">
        <label className="form-field" htmlFor="short-whatsapp">
          <span>
            WhatsApp <b aria-hidden="true">*</b>
          </span>
          <input
            id="short-whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            value={form.whatsapp}
            onChange={(e) => handleFieldChange('whatsapp', formatWhatsApp(e.target.value))}
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={errors.whatsapp ? 'short-whatsapp-error' : undefined}
            placeholder="+55 (47) 98839-2501"
            disabled={loading}
          />
          {errors.whatsapp && (
            <small id="short-whatsapp-error" className="field-error" role="alert">
              {errors.whatsapp}
            </small>
          )}
        </label>

        <label className="form-field" htmlFor="short-segmento">
          <span>
            Segmento <b aria-hidden="true">*</b>
          </span>
          <select
            id="short-segmento"
            name="segmento"
            value={form.segmento}
            onChange={(e) => handleFieldChange('segmento', e.target.value)}
            aria-invalid={Boolean(errors.segmento)}
            aria-describedby={errors.segmento ? 'short-segmento-error' : undefined}
            disabled={loading}
          >
            <option value="">Selecione o segmento...</option>
            {SEGMENTOS.map((seg) => (
              <option key={seg} value={seg}>
                {seg}
              </option>
            ))}
          </select>
          {errors.segmento && (
            <small id="short-segmento-error" className="field-error" role="alert">
              {errors.segmento}
            </small>
          )}
        </label>
      </div>

      <div className="consent-row">
        <label className="consent-field" htmlFor="short-consentimento_lgpd">
          <input
            id="short-consentimento_lgpd"
            name="consentimento_lgpd"
            type="checkbox"
            checked={form.consentimento_lgpd}
            onChange={(e) => handleFieldChange('consentimento_lgpd', e.target.checked)}
            aria-invalid={Boolean(errors.consentimento_lgpd)}
            aria-describedby={
              errors.consentimento_lgpd ? 'short-consentimento_lgpd-error' : undefined
            }
            disabled={loading}
          />
          <span className="checkbox-visual" aria-hidden="true">
            <Check size={14} />
          </span>
          <span className="consent-text">Concordo em receber contato sobre o diagnóstico.</span>
        </label>

        {/* Segundo checkbox OPCIONAL de marketing: nunca pré-marcado, separado do
            consentimento essencial (LGPD) e sem qualquer efeito no envio do formulário. */}
        <label className="consent-field" htmlFor="short-consentimento_marketing">
          <input
            id="short-consentimento_marketing"
            name="consentimento_marketing"
            type="checkbox"
            checked={form.consentimento_marketing}
            onChange={(e) => handleFieldChange('consentimento_marketing', e.target.checked)}
            disabled={loading}
          />
          <span className="checkbox-visual" aria-hidden="true">
            <Check size={14} />
          </span>
          <span className="consent-text">
            Concordo em receber novidades e conteúdos da Nozes Ink (opcional)
          </span>
        </label>

        <div className="consent-policy-link-wrapper">
          <Link
            to="/politica-de-privacidade"
            target="_blank"
            rel="noopener noreferrer"
            className="privacy-inline-link"
          >
            Ler nossa Política de Privacidade (LGPD)
          </Link>
        </div>
        {errors.consentimento_lgpd && (
          <small
            id="short-consentimento_lgpd-error"
            className="field-error checkbox-error"
            role="alert"
          >
            {errors.consentimento_lgpd}
          </small>
        )}
      </div>

      {errors.formulario && (
        <div className="form-error" role="alert">
          <p>{errors.formulario}</p>
          <a
            className="whatsapp-fallback-btn"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('clique_whatsapp', { origem: 'falha_formulario_curto' })}
          >
            <MessageCircle size={16} aria-hidden="true" /> Falar no WhatsApp
          </a>
        </div>
      )}

      <div className="form-actions">
        <DiagnosticCtaButton type="submit" source="formulario_curto" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              <span>Enviando...</span>
            </>
          ) : (
            'Solicitar meu diagnóstico'
          )}
        </DiagnosticCtaButton>

        <a
          className="whatsapp-button light"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('clique_whatsapp', { origem: 'formulario_curto' })}
        >
          <MessageCircle size={18} aria-hidden="true" /> Falar no WhatsApp
        </a>
      </div>
    </form>
  )
}

/* ==========================================================================
   FORMULÁRIO EM 3 ETAPAS (PREPARADO PARA TESTE A/B)
   Etapa 1: Segmento (cards)
   Etapa 2: Problema (cards + apoio)
   Etapa 3: Contato (Nome, Empresa, WhatsApp, LGPD)
   ========================================================================== */
function SteppedDiagnosticForm() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<LeadFieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const hasStartedRef = useRef(false)

  const selectedProblemaObj = PROBLEMAS.find((p) => p.rotulo === form.problema)

  const handleSelectSegmento = (segmento: string) => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      trackEvent('inicio_formulario', { tipo: 'etapas' })
    }
    setForm((current) => ({ ...current, segmento }))
    setErrors((current) => ({ ...current, segmento: undefined }))
    trackEvent('formulario_selecao_segmento', { segmento })
  }

  const handleSelectProblema = (problema: string) => {
    setForm((current) => ({ ...current, problema }))
    setErrors((current) => ({ ...current, problema: undefined }))
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
    const nextValue =
      event.target.type === 'checkbox'
        ? event.target.checked
        : name === 'whatsapp'
          ? formatWhatsApp(value)
          : value
    setForm((current) => ({ ...current, [name]: nextValue }))
    setErrors((current) => ({ ...current, [name]: undefined, formulario: undefined }))
  }

  const validateStep3 = (): LeadFieldErrors => {
    const errs: LeadFieldErrors = {}

    if (!form.nome.trim()) {
      errs.nome = 'Informe seu nome.'
    } else if (form.nome.trim().length > 120) {
      errs.nome = 'Use no máximo 120 caracteres.'
    }

    if (!form.empresa.trim()) {
      errs.empresa = 'Informe o nome da sua empresa.'
    } else if (form.empresa.trim().length > 120) {
      errs.empresa = 'Use no máximo 120 caracteres.'
    }

    const phoneCheck = validateWhatsAppDigits(form.whatsapp)
    if (!phoneCheck.valid) {
      errs.whatsapp = phoneCheck.message || 'WhatsApp inválido.'
    }

    if (!form.consentimento_lgpd) {
      errs.consentimento_lgpd = 'Marque para concordar em receber contato sobre o diagnóstico.'
    }

    return errs
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (form.website_trap && form.website_trap.trim().length > 0) {
      setSuccess(true)
      return
    }

    // Rate limit de 30 segundos na sessão
    const remainingCooldown = getRateLimitRemainingSeconds()
    if (remainingCooldown > 0) {
      setErrors({
        formulario: `Aguarde ${remainingCooldown} segundo${remainingCooldown > 1 ? 's' : ''} antes de enviar novamente.`,
      })
      return
    }

    const step3Errors = validateStep3()
    if (Object.keys(step3Errors).length > 0) {
      setErrors(step3Errors)
      trackEvent('envio_formulario', { resultado: 'erro_validacao', tipo: 'etapas' })
      const firstField = Object.keys(step3Errors)[0]
      document.getElementById(`step-${firstField}`)?.focus()
      return
    }

    setLoading(true)
    setErrors({})
    trackEvent('envio_formulario', {
      resultado: 'iniciado',
      tipo: 'etapas',
      variante: VARIANTE_HERO,
    })

    try {
      const cleanNome = sanitizeInput(form.nome)
      const cleanEmpresa = sanitizeInput(form.empresa)
      const cleanWhatsapp = sanitizeInput(form.whatsapp)
      const cleanSegmento = sanitizeInput(form.segmento)
      const cleanProblema = sanitizeInput(form.problema)

      const origemDetalhada = cleanProblema
        ? `formulario_etapas | problema: ${cleanProblema}`
        : 'formulario_etapas'

      await createLead({
        nome: cleanNome,
        empresa: cleanEmpresa,
        whatsapp: cleanWhatsapp,
        segmento: cleanSegmento,
        consentimento_lgpd: true,
        // Aceite opcional de marketing: registrado apenas quando marcado
        ...(form.consentimento_marketing ? { consentimento_marketing: true } : {}),
        origem: origemDetalhada,
        variante_hero: VARIANTE_HERO,
      })

      recordSubmissionTimestamp()

      trackEvent('envio_formulario', {
        resultado: 'sucesso',
        tipo: 'etapas',
        variante: VARIANTE_HERO,
        segmento: cleanSegmento,
        problema: cleanProblema,
      })
      setSuccess(true)
    } catch (error) {
      trackEvent('envio_formulario', {
        resultado: 'erro_backend',
        tipo: 'etapas',
        variante: VARIANTE_HERO,
      })
      setErrors(getLeadFieldErrors(error))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span aria-hidden="true">
          <Check size={30} />
        </span>
        <h3>Recebido. Entraremos em contato pelo WhatsApp.</h3>
        <p>Suas informações já estão com a equipe da Nozes Ink.</p>
      </div>
    )
  }

  const progressPercent = currentStep === 1 ? 33.33 : currentStep === 2 ? 66.66 : 100

  return (
    <div className="step-form-container">
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

        {currentStep === 3 && (
          <form
            className="step-slide step-3 diagnostic-form"
            onSubmit={submit}
            noValidate
            key="step-3"
          >
            <div className="sr-only" aria-hidden="true">
              <input
                name="website_trap"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website_trap}
                onChange={(e) => setForm((prev) => ({ ...prev, website_trap: e.target.value }))}
              />
            </div>

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
              <label className="form-field" htmlFor="step-nome">
                <span>
                  Nome <b aria-hidden="true">*</b>
                </span>
                <input
                  id="step-nome"
                  name="nome"
                  autoComplete="name"
                  value={form.nome}
                  onChange={update}
                  aria-invalid={Boolean(errors.nome)}
                  aria-describedby={errors.nome ? 'step-nome-error' : undefined}
                  placeholder="Como podemos chamar você?"
                  disabled={loading}
                />
                {errors.nome && (
                  <small id="step-nome-error" className="field-error">
                    {errors.nome}
                  </small>
                )}
              </label>

              <label className="form-field" htmlFor="step-empresa">
                <span>
                  Empresa <b aria-hidden="true">*</b>
                </span>
                <input
                  id="step-empresa"
                  name="empresa"
                  autoComplete="organization"
                  value={form.empresa}
                  onChange={update}
                  aria-invalid={Boolean(errors.empresa)}
                  aria-describedby={errors.empresa ? 'step-empresa-error' : undefined}
                  placeholder="Nome da sua empresa"
                  disabled={loading}
                />
                {errors.empresa && (
                  <small id="step-empresa-error" className="field-error">
                    {errors.empresa}
                  </small>
                )}
              </label>
            </div>

            <div className="field-row single-row">
              <label className="form-field" htmlFor="step-whatsapp">
                <span>
                  WhatsApp <b aria-hidden="true">*</b>
                </span>
                <input
                  id="step-whatsapp"
                  name="whatsapp"
                  type="tel"
                  autoComplete="tel"
                  value={form.whatsapp}
                  onChange={update}
                  aria-invalid={Boolean(errors.whatsapp)}
                  aria-describedby={errors.whatsapp ? 'step-whatsapp-error' : undefined}
                  placeholder="+55 (47) 98839-2501"
                  disabled={loading}
                />
                {errors.whatsapp && (
                  <small id="step-whatsapp-error" className="field-error">
                    {errors.whatsapp}
                  </small>
                )}
              </label>
            </div>

            <div className="consent-row">
              <label className="consent-field" htmlFor="step-consentimento_lgpd">
                <input
                  id="step-consentimento_lgpd"
                  name="consentimento_lgpd"
                  type="checkbox"
                  checked={form.consentimento_lgpd}
                  onChange={update}
                  aria-invalid={Boolean(errors.consentimento_lgpd)}
                  aria-describedby={
                    errors.consentimento_lgpd ? 'step-consentimento_lgpd-error' : undefined
                  }
                  disabled={loading}
                />
                <span className="checkbox-visual" aria-hidden="true">
                  <Check size={14} />
                </span>
                <span className="consent-text">
                  Concordo em receber contato sobre o diagnóstico.
                </span>
              </label>

              {/* Segundo checkbox OPCIONAL de marketing: nunca pré-marcado, separado do
                  consentimento essencial (LGPD) e sem qualquer efeito no envio. */}
              <label className="consent-field" htmlFor="step-consentimento_marketing">
                <input
                  id="step-consentimento_marketing"
                  name="consentimento_marketing"
                  type="checkbox"
                  checked={form.consentimento_marketing}
                  onChange={update}
                  disabled={loading}
                />
                <span className="checkbox-visual" aria-hidden="true">
                  <Check size={14} />
                </span>
                <span className="consent-text">
                  Concordo em receber novidades e conteúdos da Nozes Ink (opcional)
                </span>
              </label>
              <div className="consent-policy-link-wrapper">
                <Link
                  to="/politica-de-privacidade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="privacy-inline-link"
                >
                  Ler nossa Política de Privacidade (LGPD)
                </Link>
              </div>
              {errors.consentimento_lgpd && (
                <small id="step-consentimento_lgpd-error" className="field-error checkbox-error">
                  {errors.consentimento_lgpd}
                </small>
              )}
            </div>

            {errors.formulario && (
              <div className="form-error" role="alert">
                <p>{errors.formulario}</p>
                <a
                  className="whatsapp-fallback-btn"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('clique_whatsapp', { origem: 'falha_formulario_etapas' })
                  }
                >
                  <MessageCircle size={16} aria-hidden="true" /> Falar no WhatsApp
                </a>
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
              <DiagnosticCtaButton type="submit" source="formulario_etapas" disabled={loading}>
                {loading ? 'Enviando...' : 'Solicitar meu diagnóstico'}
              </DiagnosticCtaButton>
              <a
                className="whatsapp-button light"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('clique_whatsapp', { origem: 'formulario_etapas' })}
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

/* ==========================================================================
   EXPORT PRINCIPAL COM CONTROLE A/B POR FORM_AB
   - Padrão: "curto"
   - Versão "etapas" mantida no código pronta para teste A/B
   ========================================================================== */
export function DiagnosticForm() {
  if (FORM_AB === 'etapas') {
    return <SteppedDiagnosticForm />
  }
  return <ShortDiagnosticForm />
}
