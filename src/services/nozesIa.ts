import pb from '@/lib/pocketbase/client'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isAction?: boolean
  leadCaptured?: boolean
}

export interface SendChatMessageParams {
  message: string
  conversationId: string | null
  signal?: AbortSignal
}

export interface SendChatMessageResult {
  content: string
  conversation_id: string
  message_id: string
}

export async function sendChatMessage({
  message,
  conversationId,
  signal,
}: SendChatMessageParams): Promise<SendChatMessageResult> {
  const backendUrl = import.meta.env.VITE_POCKETBASE_URL || ''
  const response = await fetch(`${backendUrl}/backend/v1/nozes-ia/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
    }),
    signal,
  })

  if (!response.ok) {
    let errorMsg = 'Não foi possível se comunicar com o Nozes IA agora.'
    try {
      const data = await response.json()
      if (data?.error) {
        errorMsg = data.error
      }
    } catch {
      /* intentionally ignored */
    }
    throw new Error(errorMsg)
  }

  const data = (await response.json()) as SendChatMessageResult
  return data
}
