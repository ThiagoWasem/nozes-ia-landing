migrate(
  (app) => {
    const collection = new Collection({
      name: 'leads',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: '',
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'nome', type: 'text', required: true, max: 120 },
        { name: 'empresa', type: 'text', required: false, max: 120 },
        { name: 'whatsapp', type: 'text', required: true, max: 20 },
        { name: 'segmento', type: 'text', required: true, max: 60 },
        { name: 'consentimento_lgpd', type: 'bool', required: true },
        { name: 'origem', type: 'text', required: false, max: 30 },
        { name: 'variante_hero', type: 'text', required: false, max: 10 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_leads_created ON leads (created)',
        'CREATE INDEX idx_leads_whatsapp ON leads (whatsapp)',
      ],
    })

    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('leads')
    app.delete(collection)
  },
)
