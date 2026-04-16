import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">SIMEI Contador</h1>
          <Link href="/login" className="btn btn-primary">
            Entrar
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Contabilidade simplificada para o
          <span className="text-primary-600"> Simples Nacional</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Gerencie sua empresa, calcule o DAS automaticamente e tenha controle
          total das suas finanças em uma única plataforma.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="btn btn-primary text-lg px-8 py-3">
            Começar agora
          </Link>
          <Link href="#recursos" className="btn btn-secondary text-lg px-8 py-3">
            Saiba mais
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="recursos" className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Recursos principais
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-2">Cálculo automático do DAS</h4>
            <p className="text-gray-600">
              Calcule automaticamente o imposto baseado nos anexos do Simples Nacional
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-2">Dashboard financeiro</h4>
            <p className="text-gray-600">
              Visualize receitas, despesas e fluxo de caixa em tempo real
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-2">Alertas de vencimento</h4>
            <p className="text-gray-600">
              Nunca perca um prazo com notificações de guias e obrigações
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 SIMEI Contador. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
