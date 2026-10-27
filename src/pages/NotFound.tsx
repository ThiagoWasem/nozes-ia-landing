import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'

export default function NotFound() {
  return (
    <Layout>
      <main className="simple-page">
        <div className="shell narrow-copy">
          <p className="eyebrow">Página não encontrada</p>
          <h1>Este endereço não existe.</h1>
          <p>Volte para a página principal e solicite seu diagnóstico.</p>
          <Link className="text-link" to="/">
            Voltar para o início
          </Link>
        </div>
      </main>
    </Layout>
  )
}
