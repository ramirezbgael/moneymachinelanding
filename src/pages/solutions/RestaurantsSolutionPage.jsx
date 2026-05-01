import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MarketingHeader } from '../../components/MarketingHeader'

const faqEntities = [
  {
    q: '¿Qué es un sistema POS para restaurantes?',
    a: 'Es un sistema para registrar ventas, cobrar, controlar inventario y consultar reportes desde un mismo lugar. En restaurantes ayuda a reducir errores y acelerar la operación en caja.',
  },
  {
    q: '¿MoneyMachine funciona sin internet?',
    a: 'No. MoneyMachine es un sistema POS en la nube y requiere conexión a internet para operar y sincronizar datos.',
  },
  {
    q: '¿Qué diferencia hay entre POS local y POS en la nube?',
    a: 'El POS local se instala en un equipo específico. El POS en la nube corre desde navegador, permite acceso remoto y centraliza información en tiempo real.',
  },
  {
    q: '¿Qué necesita un restaurante para empezar?',
    a: 'Conexión a internet, un dispositivo con navegador y un catálogo base de productos para iniciar la operación.',
  },
  {
    q: '¿Cuánto tarda implementar un POS en restaurante?',
    a: 'Depende del tamaño del menú y del flujo operativo, pero en negocios pequeños puede arrancar rápido cuando el proceso de cobro está bien definido.',
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

export default function RestaurantsSolutionPage() {
  useEffect(() => {
    document.title = 'Sistema POS para restaurantes en México | MoneyMachine'
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070a] text-[#dce3eb]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <MarketingHeader />
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <article className="rounded-3xl border border-white/10 bg-[#0d1117]/95 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-8">
          <p className="inline-flex rounded-full border border-[#00ff9f]/30 bg-[#00ff9f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#95ffd8]">
            Soluciones
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Sistema POS para restaurantes en Mexico: que revisar antes de elegir uno
          </h1>
          <p className="mt-4 text-[#b5c5d1]">
            Un sistema POS para restaurantes te ayuda a tomar pedidos, cobrar mas rapido y controlar inventario en un
            solo flujo. Si operas en Mexico y necesitas visibilidad diaria desde navegador, aqui tienes lo esencial
            para evaluar una opcion sin complicarte.
          </p>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">Problemas comunes en la operacion diaria</h2>
            <p className="mt-3 text-[#a9bbc8]">
              Cuando ventas, caja e inventario viven en procesos separados, el equipo termina corrigiendo errores en
              lugar de avanzar servicio. Eso pega directo en tiempos y margen.
            </p>
            <ul className="mt-4 space-y-2 text-[#d4e0e8]">
              <li>- Comandas mal capturadas en hora pico.</li>
              <li>- Diferencias entre lo cobrado y lo registrado en caja.</li>
              <li>- Inventario desactualizado al cierre.</li>
              <li>- Reportes tardios que frenan decisiones.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">Que deberia incluir un POS para restaurante</h2>
            <ol className="mt-4 space-y-2 text-[#d4e0e8]">
              <li>1. Flujo de cobro agil para no frenar la caja.</li>
              <li>2. Inventario ligado a cada venta.</li>
              <li>3. Reportes diarios claros para decisiones de compra.</li>
              <li>4. Acceso desde laptop o telefono via navegador.</li>
              <li>5. Implementacion simple para que el equipo lo adopte rapido.</li>
            </ol>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">Como encaja MoneyMachine</h2>
            <p className="mt-3 text-[#a9bbc8]">
              MoneyMachine es un POS en la nube pensado para negocios en Mexico que quieren centralizar ventas,
              inventario y reportes. Funciona desde navegador y te da visibilidad de la operacion en tiempo real.
            </p>
            <p className="mt-3 text-[#9fefc8]">
              Importante: al ser nube, requiere internet para operar y sincronizar.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-white">Beneficios operativos para restaurante</h2>
            <ul className="mt-4 space-y-2 text-[#d4e0e8]">
              <li>- Menos errores de captura en ventas y pedidos.</li>
              <li>- Mejor control de productos e insumos criticos.</li>
              <li>- Reportes utiles sin procesos manuales largos.</li>
              <li>- Seguimiento remoto de resultados diarios.</li>
              <li>- Cierres mas ordenados con menos carga administrativa.</li>
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
              Si quieres validarlo con tu operacion real, puedes probar MoneyMachine y revisar si se adapta a tu
              restaurante.
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
