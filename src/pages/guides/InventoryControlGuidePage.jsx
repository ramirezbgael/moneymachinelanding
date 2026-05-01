import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MarketingHeader } from '../../components/MarketingHeader'

const faqEntities = [
  {
    q: '¿Cada cuanto conviene revisar inventario?',
    a: 'En negocio pequeno conviene un corte corto diario para productos criticos y una revision semanal mas amplia.',
  },
  {
    q: '¿Que productos revisar primero?',
    a: 'Primero revisa productos de mayor rotacion y mayor impacto en margen, porque son los que mas afectan operacion.',
  },
  {
    q: '¿Un POS reemplaza el conteo fisico?',
    a: 'No. Un POS mejora trazabilidad y control, pero el conteo fisico sigue siendo necesario para validar diferencias.',
  },
  {
    q: '¿MoneyMachine ayuda con inventario?',
    a: 'Si. Conecta ventas e inventario para que el stock se actualice con cada movimiento y puedas consultar reportes en tiempo real.',
  },
  {
    q: '¿MoneyMachine funciona sin internet?',
    a: 'No. MoneyMachine corre en la nube y necesita internet para operar y sincronizar informacion.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqEntities.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

export default function InventoryControlGuidePage() {
  useEffect(() => {
    document.title = 'Como controlar inventario en un negocio pequeno | MoneyMachine'
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070a] text-[#dce3eb]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <MarketingHeader />
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <article className="rounded-3xl border border-white/10 bg-[#0d1117]/95 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-8">
          <p className="inline-flex rounded-full border border-[#00ff9f]/30 bg-[#00ff9f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#95ffd8]">
            Guias
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Como controlar inventario en un negocio pequeno (sin complicarte)
          </h1>
          <p className="mt-4 text-[#b5c5d1]">
            Si tu inventario no cuadra al final del dia, normalmente el problema no es falta de esfuerzo sino falta de
            proceso. Esta guia te da un metodo simple para ordenar entradas, salidas y reposicion con menos friccion.
          </p>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">Por que se descontrola el inventario</h2>
            <ul className="mt-4 space-y-2 text-[#d4e0e8]">
              <li>- Ventas capturadas fuera del flujo principal.</li>
              <li>- Entradas y salidas sin formato unico.</li>
              <li>- Conteos esporadicos en vez de rutina corta.</li>
              <li>- Catalogo desordenado o duplicado.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">Metodo practico en 5 pasos</h2>
            <ol className="mt-4 space-y-2 text-[#d4e0e8]">
              <li>1. Ordena el catalogo con nombres unicos y unidad de medida.</li>
              <li>2. Registra todas las ventas en un solo sistema.</li>
              <li>3. Haz un corte diario de productos criticos.</li>
              <li>4. Monitorea alta rotacion para anticipar reposicion.</li>
              <li>5. Ajusta compras con reportes, no solo con intuicion.</li>
            </ol>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">Como te ayuda MoneyMachine</h2>
            <p className="mt-3 text-[#a9bbc8]">
              MoneyMachine conecta ventas, inventario y reportes en una sola operacion para reducir diferencias y
              mejorar la toma de decisiones diaria en negocios de Mexico.
            </p>
            <p className="mt-3 text-[#9fefc8]">
              Importante: funciona desde navegador y requiere internet para operar.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">Senales de mejora en inventario</h2>
            <ul className="mt-4 space-y-2 text-[#d4e0e8]">
              <li>- Menos faltantes en productos clave.</li>
              <li>- Menos compras urgentes fuera de plan.</li>
              <li>- Mayor consistencia entre venta y existencia.</li>
              <li>- Mejor previsibilidad semanal de reposicion.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">Preguntas frecuentes</h2>
            <div className="mt-4 space-y-4">
              {faqEntities.map((item) => (
                <div key={item.q} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <h3 className="font-medium text-white">{item.q}</h3>
                  <p className="mt-2 text-sm text-[#a9bbc8]">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-[#00ff9f]/25 bg-[#00ff9f]/8 p-5">
            <p className="text-sm text-[#d5f8ea]">
              Si quieres probar este flujo con tu operacion real, puedes probar MoneyMachine y validar resultados en tu
              negocio.
            </p>
            <Link
              to="/register"
              className="mt-4 inline-flex rounded-xl border border-[#00ff9f]/70 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#9affde] transition-all duration-300 hover:bg-[#00ff9f] hover:text-[#052014] hover:shadow-[0_0_24px_rgba(0,255,159,0.3)]"
            >
              Probar MoneyMachine
            </Link>
          </section>
        </article>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  )
}
