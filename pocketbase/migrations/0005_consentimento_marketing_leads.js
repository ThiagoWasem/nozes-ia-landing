/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // v0.0.23 — LGPD/CDC: consentimento de marketing separado do consentimento essencial (LGPD).
    // O novo campo é opcional (required: false) e nunca bloqueia o envio do formulário.
    const collection = app.findCollectionByNameOrId('leads')

    collection.fields.add(
      new Field({
        name: 'consentimento_marketing',
        type: 'bool',
        required: false,
      }),
    )

    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('leads')
    collection.fields.removeByName('consentimento_marketing')
    app.save(collection)
  },
)
