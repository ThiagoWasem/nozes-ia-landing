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

    const conversationId = body.conversation_id || null

    const result = $ai.agent('nozes-ia').chat({
      user_id: userId,
      conversation_id: conversationId,
      message: message,
    })

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
    if (err instanceof SkipAiAgentsError) {
      const status = err.status || 500
      return e.json(status, {
        error: status >= 500 ? 'Não foi possível processar sua mensagem agora.' : err.message,
      })
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
