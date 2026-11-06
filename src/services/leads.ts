import pb from '@/lib/pocketbase/client'

export interface LeadInput {
  nome: string
  empresa?: string
  whatsapp: string
  segmento: string
  consentimento_lgpd: true
  // Opcional e separado do consentimento essencial (LGPD): nunca pré-marcado,
  // sua ausência não impede o envio nem o atendimento do pedido.
  consentimento_marketing?: boolean
  origem: string
  variante_hero: 'A' | 'B'
}

export interface LeadFieldErrors {
  nome?: string
  empresa?: string
  whatsapp?: string
  segmento?: string
  problema?: string
  consentimento_lgpd?: string
  formulario?: string
}

const mensagens: Record<string, string> = {
  nome: 'Informe seu nome com até 120 caracteres.',
  empresa: 'Informe uma empresa com até 120 caracteres.',
  whatsapp: 'Revise o WhatsApp informado.',
  segmento: 'Selecione um segmento válido.',
  problema: 'Selecione o problema que mais pesa hoje.',
  consentimento_lgpd: 'O consentimento é obrigatório para solicitar o diagnóstico.',
}

export async function createLead(input: LeadInput) {
  return pb.collection('leads').create(input)
}

export function getLeadFieldErrors(error: unknown): LeadFieldErrors {
  const response = (error as { response?: { data?: Record<string, unknown> } })?.response
  const data = response?.data

  if (!data || typeof data !== 'object') {
    return { formulario: 'Não foi possível enviar agora. Revise os campos e tente novamente.' }
  }

  const fieldErrors: LeadFieldErrors = {}
  Object.keys(data).forEach((field) => {
    if (field in mensagens) {
      fieldErrors[field as keyof Omit<LeadFieldErrors, 'formulario'>] = mensagens[field]
    }
  })

  if (Object.keys(fieldErrors).length === 0) {
    fieldErrors.formulario = 'Não foi possível enviar agora. Revise os campos e tente novamente.'
  }

  return fieldErrors
}
