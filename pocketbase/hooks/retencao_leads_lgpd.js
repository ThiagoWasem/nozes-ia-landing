/// <reference path="../pb_data/types.d.ts" />

// v0.0.23 — LGPD: retenção e descarte de dados da coleção `leads`.
//
// Regra conservadora adotada (o lead ainda não tem status de "convertido"):
//   - Leads de FORMULÁRIO ou CHAT não marcados como cliente são apagados
//     12 meses (365 dias) após a criação.
//   - Quando no futuro existir um campo para distinguir cliente convertido
//     (ex.: status "cliente"), o prazo passa a ser de 2 anos de inatividade;
//     por hoje, todo lead não-cliente segue o prazo de 12 meses.
//   - Em vez de DELETE imediato, o job ANONIMIZA os dados de contato
//     (nome, empresa, whatsapp, consentimentos) preservando a linha com
//     origem e data, o que mantém histórico estatístico sem dado pessoal.
//
// O job é diário, loga o que fez e é seguro em banco vazio.

cronAdd('retencao-leads-lgpd', '0 4 * * *', () => {
  const COLECAO = 'leads'
  const PRAZO_DIAS = 365 // 12 meses — leads de formulário/chat não convertidos

  const corte = new Date()
  corte.setDate(corte.getDate() - PRAZO_DIAS)
  const corteISO = corte.toISOString().replace('T', ' ')

  let registros = []
  try {
    registros = $app.findRecordsByFilter(COLECAO, 'created < {:corte}', '-created', 500, 0, {
      corte: corteISO,
    })
  } catch (err) {
    console.error('[retencao-leads] Falha ao buscar leads vencidos:', err?.message || err)
    return
  }

  if (!registros || registros.length === 0) {
    console.log('[retencao-leads] Nenhum lead vencido para anonimizar hoje.')
    return
  }

  let anonimizados = 0
  let falhas = 0

  registros.forEach((record) => {
    try {
      record.set('nome', '[anônimo]')
      record.set('empresa', '')
      record.set('whatsapp', '')
      record.set('consentimento_lgpd', false)
      record.set('consentimento_marketing', false)
      $app.save(record)
      anonimizados += 1
    } catch (err) {
      falhas += 1
      console.error(`[retencao-leads] Falha ao anonimizar lead ${record.id}:`, err?.message || err)
    }
  })

  console.log(
    `[retencao-leads] Execução concluída: ${anonimizados} lead(s) anonimizado(s), ${falhas} falha(s). Prazo aplicado: ${PRAZO_DIAS} dias.`,
  )
})
