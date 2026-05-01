import { Link } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'

const guideLinks = [
  {
    href: '/guias/como-controlar-inventario-negocio',
    title: 'Control de inventario en negocio pequeno',
    desc: 'Metodo base para ordenar entradas, salidas y reposicion.',
  },
  {
    href: '/guias/pos-para-restaurantes-pequenos',
    title: 'POS para restaurantes pequenos',
    desc: 'Como elegir sin sobrepagar ni complicar al equipo.',
  },
  {
    href: '/guias/como-llevar-control-de-caja-en-restaurante',
    title: 'Control de caja en restaurante',
    desc: 'Pasos para reducir diferencias y cerrar mejor.',
  },
  {
    href: '/guias/como-reducir-mermas-en-restaurante',
    title: 'Reducir mermas en restaurante',
    desc: 'Acciones diarias para bajar desperdicio y mejorar margen.',
  },
  {
    href: '/guias/como-mejorar-tiempos-de-cobro-restaurante',
    title: 'Mejorar tiempos de cobro',
    desc: 'Ajustes operativos para acelerar caja en hora pico.',
  },
]

export default function GuidesIndexPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070a] text-[#dce3eb]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <MarketingHeader />
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Guias para operacion en restaurantes</h1>
        <p className="mt-3 max-w-2xl text-[#a9bbc8]">
          Recursos practicos para resolver problemas operativos frecuentes y tomar mejores decisiones con datos.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {guideLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-2xl border border-white/10 bg-[#0d1117]/90 p-5 transition hover:border-[#00ff9f]/35"
            >
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-[#a9bbc8]">{item.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
