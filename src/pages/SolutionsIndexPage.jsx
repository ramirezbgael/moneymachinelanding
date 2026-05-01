import { Link } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'

const solutionLinks = [
  {
    href: '/soluciones/restaurantes',
    title: 'Solucion para restaurantes',
    desc: 'Panorama rapido de problemas operativos y enfoque recomendado.',
  },
  {
    href: '/soluciones/sistema-pos-para-restaurantes',
    title: 'Sistema POS para restaurantes',
    desc: 'Checklist practico para evaluar un POS en Mexico.',
  },
  {
    href: '/soluciones/software-para-restaurantes-en-mexico',
    title: 'Software para restaurantes en Mexico',
    desc: 'Que funciones importan de verdad para operar mejor.',
  },
  {
    href: '/soluciones/landing/sistema-pos-restaurantes-mexico',
    title: 'Landing SEO - sistema POS restaurantes',
    desc: 'Version landing estilo homepage enfocada a keyword transaccional.',
  },
  {
    href: '/soluciones/landing/software-punto-venta-restaurantes',
    title: 'Landing SEO - software punto de venta restaurantes',
    desc: 'Landing comercial SEO para captacion mid-funnel.',
  },
  {
    href: '/soluciones/landing/pos-para-taquerias-mexico',
    title: 'Landing SEO - POS para taquerias',
    desc: 'Landing vertical para operacion de taquerias en Mexico.',
  },
  {
    href: '/soluciones/landing/pos-para-cafeterias-mexico',
    title: 'Landing SEO - POS para cafeterias',
    desc: 'Landing orientada a flujo rapido en barra y caja.',
  },
  {
    href: '/soluciones/landing/pos-para-pizzerias-mexico',
    title: 'Landing SEO - POS para pizzerias',
    desc: 'Landing para operacion diaria de pizzerias.',
  },
  {
    href: '/soluciones/landing/pos-para-bares-mexico',
    title: 'Landing SEO - POS para bares',
    desc: 'Landing para control de caja y alta demanda nocturna.',
  },
  {
    href: '/soluciones/landing/sistema-pos-para-food-trucks',
    title: 'Landing SEO - POS para food trucks',
    desc: 'Landing para negocio movil con control centralizado.',
  },
  {
    href: '/soluciones/landing/software-para-cocinas-economicas',
    title: 'Landing SEO - software para cocinas economicas',
    desc: 'Landing para operacion de alto volumen diario.',
  },
  {
    href: '/soluciones/landing/sistema-pos-para-panaderias',
    title: 'Landing SEO - POS para panaderias',
    desc: 'Landing para mostrador, inventario y ticket rapido.',
  },
  {
    href: '/soluciones/landing/sistema-pos-para-reposterias',
    title: 'Landing SEO - POS para reposterias',
    desc: 'Landing para pedidos, stock y control comercial.',
  },
  {
    href: '/soluciones/pos-para-taquerias',
    title: 'POS para taquerias',
    desc: 'Landing comercial para taquerias con enfoque operativo.',
  },
  {
    href: '/soluciones/pos-para-cafeterias',
    title: 'POS para cafeterias',
    desc: 'Landing orientada a flujo en barra y cobro rapido.',
  },
  {
    href: '/soluciones/pos-para-pizzerias',
    title: 'POS para pizzerias',
    desc: 'Landing enfocada en pedidos, inventario y reportes.',
  },
  {
    href: '/soluciones/pos-para-bares',
    title: 'POS para bares',
    desc: 'Landing para control de caja y cobro en hora pico.',
  },
  {
    href: '/soluciones/pos-para-food-trucks',
    title: 'POS para food trucks',
    desc: 'Landing para operacion movil y control diario.',
  },
  {
    href: '/soluciones/pos-para-fondas',
    title: 'POS para fondas',
    desc: 'Landing para ordenar cobro e inventario en negocio local.',
  },
  {
    href: '/soluciones/pos-para-panaderias',
    title: 'POS para panaderias',
    desc: 'Landing para alto volumen de tickets en mostrador.',
  },
  {
    href: '/soluciones/pos-para-reposterias',
    title: 'POS para reposterias',
    desc: 'Landing para pedidos y control de insumos.',
  },
  {
    href: '/soluciones/pos-para-marisquerias',
    title: 'POS para marisquerias',
    desc: 'Landing para control diario en operacion rapida.',
  },
  {
    href: '/soluciones/pos-para-cocinas-economicas',
    title: 'POS para cocinas economicas',
    desc: 'Landing para mejorar orden operativo y caja.',
  },
]

export default function SolutionsIndexPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070a] text-[#dce3eb]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <MarketingHeader />
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Soluciones para restaurantes</h1>
        <p className="mt-3 max-w-2xl text-[#a9bbc8]">
          Contenido orientado a operadores que quieren vender mas rapido, controlar inventario y tomar decisiones con
          reportes claros.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutionLinks.map((item) => (
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
