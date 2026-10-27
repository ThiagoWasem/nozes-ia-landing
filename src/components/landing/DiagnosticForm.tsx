import { ChangeEvent, FormEvent, useState } from 'react'
import { Check, MessageCircle } from 'lucide-react'
import { DiagnosticCtaButton } from '@/components/DiagnosticCtaButton'
import { createLead, getLeadFieldErrors, LeadFieldErrors } from '@/services/leads'
import { SEGMENTOS, VARIANTE_HERO, WHATSAPP_URL } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'

interface FormState {
  nome: string
  empresa: string
  whatsapp: string
  segmento: string
  consentimento_lgpd: boolean
}

const initial: FormState = {
  nome: '',
  empresa: '',
  whatsapp: '',
  segmento: '',
  consentimento_lgpd: false,
}

function validate(data: FormState): LeadFieldErrors {
  const errors: LeadFieldErrors = {}
  const digits = data.whatsapp.replace(/\D/g, '')
  if (!data.nome.trim()) errors.nome = 'Informe seu nome.'
  else if (data.nome.trim().length > 120) errors.nome = 'Use no máximo 120 caracteres.'
  if (data.empresa.trim().length > 120) errors.empresa = 'Use no máximo 120 caracteres.'
  if (!/^\d{10,13}$/.test(digits))
    errors.whatsapp = 'Informe DDD e número. Exemplo: (47) 99999-9999.'
  if (!SEGMENTOS.includes(data.segmento as (typeof SEGMENTOS)[number]))
    errors.segmento = 'Selecione um segmento.'
  if (!data.consentimento_lgpd) errors.consentimento_lgpd = 'Marque o consentimento para continuar.'
  return errors
}

export function DiagnosticForm() {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<LeadFieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const update = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    const nextValue =
      event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
        ? event.target.checked
        : value
    setForm((current) => ({ ...current, [name]: nextValue }))
    setErrors((current) => ({ ...current, [name]: undefined, formulario: undefined }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const clientErrors = validate(form)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      trackEvent('envio_formulario', { resultado: 'erro_validacao' })
      const firstField = Object.keys(clientErrors)[0]
      document.getElementById(firstField)?.focus()
      return
    }

    setLoading(true)
    setErrors({})

    // BLOCO DE ENVIO DO FORMULÁRIO: única gravação de dados da landing no PocketBase.
    try {
      await createLead({
        nome: form.nome.trim(),
        empresa: form.empresa.trim() || undefined,
        whatsapp: form.whatsapp.trim(),
        segmento: form.segmento,
        consentimento_lgpd: true,
        origem: 'formulario',
        variante_hero: VARIANTE_HERO,
      })
      trackEvent('envio_formulario', { resultado: 'sucesso', variante: VARIANTE_HERO })
      setSuccess(true)
    } catch (error) {
      setErrors(getLeadFieldErrors(error))
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

  return (
    <form className="diagnostic-form" onSubmit={submit} noValidate>
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
            placeholder="Nome da empresa"
          />
          {errors.empresa && (
            <small id="empresa-error" className="field-error">
              {errors.empresa}
            </small>
          )}
        </label>
      </div>
      <div className="field-row">
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
            placeholder="(47) 99999-9999"
          />
          {errors.whatsapp && (
            <small id="whatsapp-error" className="field-error">
              {errors.whatsapp}
            </small>
          )}
        </label>
        <label className="form-field" htmlFor="segmento">
          <span>
            Segmento <b aria-hidden="true">*</b>
          </span>
          <select
            id="segmento"
            name="segmento"
            value={form.segmento}
            onChange={update}
            aria-invalid={Boolean(errors.segmento)}
            aria-describedby={errors.segmento ? 'segmento-error' : undefined}
          >
            <option value="">Selecione</option>
            {SEGMENTOS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.segmento && (
            <small id="segmento-error" className="field-error">
              {errors.segmento}
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
          aria-describedby={errors.consentimento_lgpd ? 'consentimento_lgpd-error' : undefined}
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
      <div className="form-actions">
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
  )
}
