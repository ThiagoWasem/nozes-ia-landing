/// <reference path="../pb_data/types.d.ts" />

routerAdd('POST', '/backend/v1/nozes-ia/chat', (e) => {
  try {
    const body = e.requestInfo().body || {}
    const message = (body.message || '').toString().trim()
    if (!message) {
      return e.badRequestError('A mensagem é obrigatória.')
    }

    // Identificar ou resolver usuário de serviço para chats públicos
    let userId = e.auth?.id
    if (!userId) {
      try {
        const guestUser = e.app.findAuthRecordByEmail('users', 'visitante-chat@nozes.ink')
        userId = guestUser.id
      } catch (_) {
        // Fallback defensivo caso o usuário de serviço precise ser criado dinamicamente
        const usersCol = e.app.findCollectionByNameOrId('users')
        const newGuest = new Record(usersCol)
        newGuest.setEmail('visitante-chat@nozes.ink')
        newGuest.setPassword($security.randomString(32))
        newGuest.setVerified(true)
        newGuest.set('name', 'Visitante Chat Landing')
        e.app.save(newGuest)
        userId = newGuest.id
      }
    }

    // Suporte robusto a continuidade de contexto:
    // 1. conversation_id nativo do agente de IA
    // 2. history opcional [{ role: 'user'|'assistant', content: string }] vindo do cliente
    // Se o cliente enviar o histórico anterior da sessão, prefixamos no prompt para garantir
    // compreensão contínua imediata caso a conversa ainda esteja sem ID persistido ou recém-criada
    let promptToSend = message
    const rawHistory = Array.isArray(body.history) ? body.history : []
    const validHistory = rawHistory
      .filter(
        (item) =>
          item &&
          (item.role === 'user' || item.role === 'assistant') &&
          typeof item.content === 'string',
      )
      .slice(-10) // últimas 10 trocas de mensagens na sessão

    // Se temos histórico recente anterior à mensagem atual e a mensagem é curta/dependente de contexto
    if (validHistory.length > 0) {
      const formattedHistory = validHistory
        .map(
          (item) =>
            `${item.role === 'user' ? 'Visitante' : 'Assistente Nozes IA'}: ${item.content.trim()}`,
        )
        .join('\n')

      promptToSend = `[HISTÓRICO DA CONVERSA NESTA SESSÃO]:\n${formattedHistory}\n\n[NOVA MENSAGEM DO VISITANTE]:\n${message}`
    }

    let conversationId = body.conversation_id || null
    let result

    try {
      result = $ai.agent('nozes-ia').chat({
        user_id: userId,
        conversation_id: conversationId,
        message: promptToSend,
      })
    } catch (chatErr) {
      // Se falhar por conversation_id expirado/inválido, tenta novamente iniciando nova conversa
      if (
        conversationId &&
        (chatErr instanceof SkipAiAgentsError ||
          (chatErr && chatErr.message && chatErr.message.includes('conversation')))
      ) {
        conversationId = null
        result = $ai.agent('nozes-ia').chat({
          user_id: userId,
          conversation_id: null,
          message: promptToSend,
        })
      } else {
        throw chatErr
      }
    }

    return e.json(200, {
      conversation_id: result.conversation_id,
      content: result.content,
      citations: result.citations || [],
      message_id: result.message_id,
    })
  } catch (err) {
    if (err instanceof SkipAiConfigError) {
      return e.json(503, { error: 'O assistente de IA está temporariamente indisponível.' })
    }
    if (err instanceof SkipAiError) {
      const status = err.status || 502
      return e.json(status, {
        error: status >= 500 ? 'O serviço de IA está temporariamente ocupado.' : err.message,
      })
    }
    return e.json(500, {
      error: 'Ocorreu um erro inesperado ao falar com o assistente.',
    })
  }
})
