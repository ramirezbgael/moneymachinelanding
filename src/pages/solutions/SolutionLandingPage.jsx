import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { MarketingHeader } from '../../components/MarketingHeader'
import { SOLUTION_LANDING_DATA } from '../../lib/solutionLandingData'

export default function SolutionLandingPage() {
  const { slug } = useParams()
  const landing = slug ? SOLUTION_LANDING_DATA[slug] : null

  useEffect(() => {
    if (!landing) return
    document.title = `${landing.title} | MoneyMachine`
    const metaDescription = `${landing.subtitle} Descubre como MoneyMachine ayuda a vender mas rapido y controlar inventario en Mexico.`
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', metaDescription)
  }, [landing])

  if (!landing) return <Navigate to="/soluciones" replace />

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070a] text-[#dce3eb]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <MarketingHeader />
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="rounded-3xl border border-white/10 bg-[#0d1117]/95 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-8">
            <p className="inline-flex rounded-full border border-[#00ff9f]/30 bg-[#00ff9f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#95ffd8]">
              {landing.badge}
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl">{landing.title}</h1>
            <p className="mt-4 max-w-3xl text-[#b5c5d1]">{landing.subtitle}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex rounded-xl border border-[#00ff9f]/70 bg-transparent px-5 py-2.5 text-sm font-semibold text-[#9affde] transition-all duration-300 hover:bg-[#00ff9f] hover:text-[#052014] hover:shadow-[0_0_24px_rgba(0,255,159,0.3)]"
              >
                Probar MoneyMachine
              </Link>
              <Link
                to="/pricing"
                className="inline-flex rounded-xl border border-white/15 bg-white/[0.02] px-5 py-2.5 text-sm font-semibold text-[#d9e6ee] transition hover:border-[#00ff9f]/35"
              >
                Ver precios
              </Link>
            </div>
            <p className="mt-4 text-xs text-[#84a0b2]">En la nube · Desde navegador · Requiere internet</p>
          </div>

          <div className="grid gap-4">
            <article className="rounded-2xl border border-[#23463e] bg-[linear-gradient(145deg,rgba(0,255,159,0.12),rgba(11,16,22,0.95))] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#95ffd8]">Retos del giro</p>
              <ul className="mt-3 space-y-2 text-sm text-[#d5e3ec]">
                {landing.painPoints.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#0d1117]/92 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#95ffd8]">Resultado esperado</p>
              <ul className="mt-3 space-y-2 text-sm text-[#d5e3ec]">
                {landing.benefits.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Ventas',
              text: 'Flujo de cobro rapido para operar mejor en horas pico.',
            },
            {
              title: 'Inventario',
              text: 'Control de stock conectado a cada ticket.',
            },
            {
              title: 'Reportes',
              text: 'Datos diarios para decidir compras y operacion.',
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-[#0d1117]/92 p-5">
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-[#a9bbc8]">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-[#00ff9f]/25 bg-[#00ff9f]/8 p-6">
          <h2 className="text-xl font-semibold text-white">Pruebalo en tu operacion real</h2>
          <p className="mt-3 max-w-3xl text-[#d5f8ea]">
            Esta landing esta pensada para responder busquedas especificas de tu tipo de negocio. Si tu operacion se
            parece a este escenario, puedes validarlo directamente con una prueba en MoneyMachine.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex rounded-xl border border-[#00ff9f]/70 bg-transparent px-5 py-2.5 text-sm font-semibold text-[#9affde] transition-all duration-300 hover:bg-[#00ff9f] hover:text-[#052014] hover:shadow-[0_0_24px_rgba(0,255,159,0.3)]"
            >
              Empezar prueba
            </Link>
            <Link
              to="/soluciones"
              className="inline-flex rounded-xl border border-white/15 bg-white/[0.02] px-5 py-2.5 text-sm font-semibold text-[#d9e6ee] transition hover:border-[#00ff9f]/35"
            >
              Ver mas soluciones
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
