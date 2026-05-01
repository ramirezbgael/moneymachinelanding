import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Dumbbell,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react'
import { MarketingHeader } from '../components/MarketingHeader'
import { LiveDashboardPreview } from '../components/landing/LiveDashboardPreview'
import { getPlansByBusinessType } from '../lib/pricingPlans'

export default function LandingPage() {
  const [category, setCategory] = useState('restaurant')
  const [heroSales, setHeroSales] = useState(38691)
  const [heroOrders, setHeroOrders] = useState(21)
  const [heroTicket, setHeroTicket] = useState(580)
  const [heroClients, setHeroClients] = useState(25)
  const categoryTitle = category === 'restaurant' ? 'tu restaurante' : category === 'retail' ? 'tu tienda' : 'tu gym'
  const categoryPlans = useMemo(() => getPlansByBusinessType(category), [category])

  useEffect(() => {
    const heroStatsTimer = setInterval(() => {
      setHeroSales((prev) => prev + Math.floor(Math.random() * 120 + 30))
      setHeroOrders((prev) => (prev >= 29 ? 21 : prev + 1))
      setHeroTicket((prev) => (prev >= 640 ? 580 : prev + Math.floor(Math.random() * 5 + 1)))
      setHeroClients((prev) => (prev >= 34 ? 25 : prev + 1))
    }, 1800)

    return () => clearInterval(heroStatsTimer)
  }, [])

  return (
    <div className="relative overflow-x-hidden bg-[#05070a] text-[#dce3eb]">
      <MarketingHeader />
      <div className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <motion.div
          className="absolute -top-36 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,255,159,0.2),transparent_70%)] blur-2xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.8, 0.55] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <section className="grid gap-8 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-20">
          <div>
            <p className="inline-flex rounded-full border border-[#00ff9f]/20 bg-[#00ff9f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7af6c6]">
              Hecho para tu negocio
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-6xl">
              Controla tu negocio
              <span className="block text-[#46f7b4]">como una máquina</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-[#a5b5c2] sm:text-lg">Más ventas, menos fricción, todo desde tu celular.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-[#00ff9f] px-6 py-3 text-sm font-semibold text-[#052014] shadow-[0_0_32px_rgba(0,255,159,0.35)] transition hover:scale-[1.02]"
              >
                Empieza gratis
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-[#d2dee7] backdrop-blur"
              >
                Ver demo
              </a>
            </div>
            <p className="mt-5 text-xs text-[#84a0b2]">7 días gratis · Sin tarjeta</p>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] rounded-3xl border border-white/10 bg-[#0d1117]/92 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-5">
            <motion.div
              className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#00ff9f]/10 blur-3xl"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4.8, repeat: Infinity }}
            />
            <motion.div
              className="grid gap-3 sm:grid-cols-[1fr_128px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -3, 0] }}
              transition={{
                opacity: { duration: 0.35 },
                y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <motion.div
                className="rounded-2xl border border-white/10 bg-[#0b0f14] p-3 sm:p-4"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs text-[#8fa4b3]">Resumen de hoy</p>
                <motion.p
                  key={heroSales}
                  className="mt-1 text-3xl font-semibold text-white"
                  initial={{ opacity: 0.6, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  ${heroSales.toLocaleString()}
                </motion.p>
                <motion.p
                  className="text-xs text-[#7bf1c5]"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  +12.5% vs ayer
                </motion.p>
                <svg viewBox="0 0 280 90" className="mt-3 h-20 w-full">
                  <defs>
                    <linearGradient id="heroLine" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(95,255,197,0.4)" />
                      <stop offset="100%" stopColor="rgba(95,255,197,1)" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0 72 L34 68 L66 54 L98 59 L132 46 L166 40 L202 49 L236 28 L280 22"
                    fill="none"
                    stroke="url(#heroLine)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0.25, opacity: 0.75 }}
                    animate={{ pathLength: [0.25, 1, 0.9, 1], opacity: [0.75, 1, 0.9, 1] }}
                    transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.circle
                    r="3.5"
                    fill="rgba(95,255,197,1)"
                    initial={{ cx: 34, cy: 68 }}
                    animate={{ cx: [34, 66, 98, 132, 166, 202, 236, 280], cy: [68, 54, 59, 46, 40, 49, 28, 22] }}
                    transition={{ duration: 5.8, repeat: Infinity, ease: 'linear' }}
                  />
                </svg>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    ['Pedidos', String(heroOrders)],
                    ['Ticket', `$${heroTicket}`],
                    ['Clientes', String(heroClients)],
                  ].map(([label, value], idx) => (
                    <motion.div
                      key={label}
                      className="rounded-lg border border-white/10 bg-white/[0.02] p-2"
                      initial={{ opacity: 0.8, y: 0 }}
                      animate={{ opacity: [0.82, 1, 0.82], y: [0, -1, 0] }}
                      transition={{ duration: 2.4, delay: idx * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <p className="text-[10px] text-[#8599a8]">{label}</p>
                      <motion.p
                        key={`${label}-${value}`}
                        className="text-sm font-semibold text-white"
                        initial={{ opacity: 0.55, y: 1 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                      >
                        {value}
                      </motion.p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                className="rounded-[1.7rem] border border-[#2b4741] bg-[#070b10] p-2"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3.3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="h-full rounded-[1.1rem] border border-white/10 bg-[#0f141b] p-2">
                  <p className="text-[10px] text-[#9cb0be]">Nueva venta</p>
                  <div className="mt-2 space-y-1.5">
                    {['Cafe Americano', 'Agua Mineral', 'Granola Bowl'].map((item, idx) => (
                      <motion.div
                        key={item}
                        className="flex items-center justify-between text-[10px] text-[#d8e3ea]"
                        initial={{ opacity: 0.4, x: -2 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 + idx * 0.12 }}
                      >
                        <span>{item}</span>
                        <span>$89</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    className="mt-3 rounded-lg border border-[#1f6b52] bg-[#00ff9f]/15 px-2 py-1 text-center text-[10px] font-semibold text-[#9affe0]"
                    animate={{ boxShadow: ['0 0 0 rgba(0,255,159,0)', '0 0 18px rgba(0,255,159,0.22)', '0 0 0 rgba(0,255,159,0)'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Cobro listo
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Ahorra tiempo', text: 'Automatiza tareas y enfócate en lo importante.' },
            { title: 'Vende más', text: 'Toma mejores decisiones con datos reales.' },
            { title: 'Sin errores', text: 'Reduce fallos humanos y pérdidas.' },
            { title: 'Siempre contigo', text: 'Accede desde cualquier lugar y dispositivo.' },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[#24483f] bg-[linear-gradient(140deg,rgba(0,255,159,0.1),rgba(8,12,16,0.92))] px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#2c5b4f] bg-[#0f1a17]">
                  <ShieldCheck className="h-4 w-4 text-[#7ef4cb]" />
                </span>
                <p className="text-sm font-semibold text-white">{item.title}</p>
              </div>
              <p className="mt-1 text-xs text-[#a9bcc9]">{item.text}</p>
            </article>
          ))}
        </section>

        <section id="demo" className="mt-16">
          <LiveDashboardPreview />
        </section>

        <section id="funciones" className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-[#00ff9f]/25 bg-[#00ff9f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8cffd3]">
              Hecho para tu negocio
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Un sistema. Tres industrias.
              <span className="block text-[#46f7b4]">Resultados reales.</span>
            </h2>
          </div>

          <div id="industrias" className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              {
                title: 'Restaurantes',
                subtitle: 'Pedidos al instante desde el celular',
                bullets: ['Comandas digitales', 'Menos errores', 'Mas velocidad'],
                cta: 'Ver planes para restaurantes',
                Icon: UtensilsCrossed,
                badge: 'Mas ventas',
                mockLabel: 'Mock restaurante',
                mockTone: 'from-[#2a1d14] via-[#131920] to-[#0a0f15]',
                cardTone: 'from-[#20150f] via-[#10151d] to-[#090d13]',
                iconTone: 'text-[#ffb870]',
                borderTone: 'border-[#5a3b2b]',
                badgeTone: 'bg-[#ff9f43]/15 border-[#ff9f43]/35 text-[#ffd3a2]',
                glowTone: 'bg-[#ff9f43]/25',
              },
              {
                title: 'Gimnasios',
                subtitle: 'Accesos y suscripciones automáticas',
                bullets: ['QR automatico', 'Pagos recurrentes', 'Control total'],
                cta: 'Ver planes para gimnasios',
                Icon: Dumbbell,
                badge: 'Mas control',
                mockLabel: 'Mock gimnasio',
                mockTone: 'from-[#101a2f] via-[#101723] to-[#0a1019]',
                cardTone: 'from-[#10182b] via-[#0f1520] to-[#090f17]',
                iconTone: 'text-[#77acff]',
                borderTone: 'border-[#2f4572]',
                badgeTone: 'bg-[#4f7dff]/18 border-[#5d8bff]/35 text-[#c6d8ff]',
                glowTone: 'bg-[#5d8bff]/25',
              },
              {
                title: 'Commerce',
                subtitle: 'Ventas e inventario en tiempo real',
                bullets: ['TPV rapido', 'Inventario en tiempo real', 'Clientes'],
                cta: 'Ver planes para Commerce',
                Icon: ShoppingBag,
                badge: 'Mas eficiencia',
                mockLabel: 'Mock tienda',
                mockTone: 'from-[#1d2a1f] via-[#11191c] to-[#0a1115]',
                cardTone: 'from-[#112016] via-[#0d1717] to-[#090f13]',
                iconTone: 'text-[#52f2b1]',
                borderTone: 'border-[#295442]',
                badgeTone: 'bg-[#38d996]/16 border-[#38d996]/35 text-[#bafde0]',
                glowTone: 'bg-[#38d996]/25',
              },
            ].map((useCase, idx) => (
              <motion.article
                key={useCase.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-b ${useCase.cardTone} ${useCase.borderTone} shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_16px_40px_rgba(0,0,0,0.35)]`}
              >
                <motion.div
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl ${useCase.glowTone}`}
                  animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.35 }}
                />
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-lg border border-white/20 bg-white/10 p-1.5 ${useCase.iconTone}`}>
                        <useCase.Icon className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d8e7f1]">
                        {useCase.title}
                      </p>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${useCase.badgeTone}`}>
                      {useCase.badge}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_118px] sm:items-start">
                    <h3 className="text-3xl font-semibold leading-tight text-white">{useCase.subtitle}</h3>
                    <div
                      className={`relative min-h-[138px] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${useCase.mockTone}`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.24),transparent_45%)]"
                        animate={{ opacity: [0.45, 0.9, 0.45] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <div className="absolute inset-x-2 bottom-2 rounded-md border border-white/15 bg-black/35 px-2 py-1 text-center text-[10px] font-medium text-[#dce7ef]">
                        {useCase.mockLabel}
                      </div>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2 text-sm text-[#d1dee8]">
                    {useCase.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2">
                        <Check className={`h-4 w-4 shrink-0 ${useCase.iconTone}`} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#pricing"
                  className="mt-auto flex items-center justify-center gap-2 border-t border-white/[0.08] bg-black/20 px-4 py-3 text-sm font-medium text-[#e5e7eb] transition group-hover:bg-black/35"
                >
                  {useCase.cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </a>
              </motion.article>
            ))}
          </div>

        </section>

        <section id="pricing" className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#77f3c3]">
              Planes disenados para tu negocio
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-5xl">
              Elige lo ideal
              <span className="block text-[#46f7b4]">para {categoryTitle}</span>
            </h2>
          </div>

          <div className="mx-auto mt-10 flex w-fit flex-wrap rounded-2xl border border-white/10 bg-[#101010]/92 p-1.5">
            {[
              { id: 'restaurant', label: 'Restaurantes' },
              { id: 'retail', label: 'Commerce' },
              { id: 'gym', label: 'Gym' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={`rounded-xl px-5 py-2 text-sm transition ${
                  category === tab.id
                    ? 'border border-[#00ff9f]/40 bg-[#00ff9f]/15 text-[#99ffd8] shadow-[0_0_18px_rgba(0,255,159,0.18)]'
                    : 'border border-transparent bg-transparent text-[#9db0bf]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryPlans.map((plan) => (
              <PricingCard
                key={plan.key}
                name={plan.name}
                price={plan.priceLabel}
                subtitle=""
                bullets={plan.features}
                highlight={plan.key === 'pro'}
                badge={plan.badge ?? ''}
              />
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Inventario',
                text: 'Nunca te quedes sin producto',
              },
              {
                title: 'Clientes',
                text: 'Vende mas a los que ya te compraron',
              },
              {
                title: 'Suscripciones',
                text: 'Ingresos recurrentes sin esfuerzo',
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-[28px] border border-[#22c55e]/30 bg-[linear-gradient(145deg,rgba(34,197,94,0.16),rgba(12,12,12,0.82))] p-4 text-center shadow-[0_0_24px_rgba(34,197,94,0.12)] backdrop-blur-xl"
              >
                <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/12 px-2.5 py-1 text-xs text-[#9df8d2]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Resultado real
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm text-[#c9d7e1]">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

      </main>

      <footer className="relative z-10 border-t border-white/[0.08] bg-[linear-gradient(180deg,#0f1218,#090b11)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end">
            <div>
              <p className="text-[clamp(2.4rem,9vw,6.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em] text-white">
                MoneyMachine
              </p>
              <p className="mt-4 max-w-md text-sm text-[#9fb2c0]">La forma simple de operar tu negocio.</p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm text-[#a8bac7] sm:grid-cols-3">
              <div className="space-y-2">
                <a href="#funciones" className="block hover:text-white">Funciones</a>
                <a href="#pricing" className="block hover:text-white">Precios</a>
                <a href="#demo" className="block hover:text-white">Demo</a>
              </div>
              <div className="space-y-2">
                <a href="#pricing" className="block hover:text-white">Restaurantes</a>
                <a href="#pricing" className="block hover:text-white">Gimnasios</a>
                <a href="#pricing" className="block hover:text-white">Commerce</a>
              </div>
              <div className="space-y-2">
                <a href="/terms" className="block hover:text-white">Terminos</a>
                <a href="/privacy" className="block hover:text-white">Privacidad</a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/[0.08] pt-4 text-xs text-[#8091a0]">© 2026 MoneyMachine</div>
        </div>
      </footer>
    </div>
  )
}

function PricingCard({ name, price, subtitle = '', bullets, highlight = false, badge = '' }) {
  return (
    <article
      className={`rounded-2xl border p-5 backdrop-blur-xl ${
        highlight
          ? 'border-[#22c55e]/40 bg-gradient-to-br from-[#121212]/95 via-[#101010]/95 to-[#0e1a12]/92 shadow-[0_0_40px_rgba(34,197,94,0.12)]'
          : 'border-white/[0.08] bg-[#121212]/92'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        {badge ? (
          <span className="rounded-full border border-[#22c55e]/40 bg-[#22c55e]/15 px-2.5 py-1 text-xs font-medium text-[#92ffd6]">
            {badge}
          </span>
        ) : null}
      </div>
      {subtitle ? <p className="mt-1 text-sm text-[#9fb2c1]">{subtitle}</p> : null}
      <p className="mt-2 text-xl font-semibold text-[#92ffd6]">{price}</p>
      <ul className="mt-4 space-y-2 text-sm text-[#b6c3ce]">
        {bullets.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00ff9f]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/register"
        className={`mt-5 inline-flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
          highlight
            ? 'bg-[#00ff9f] text-[#062016] shadow-[0_0_24px_rgba(0,255,159,0.28)]'
            : 'border border-white/15 bg-white/[0.02] text-[#d9e6ee] hover:border-[#00ff9f]/35'
        }`}
      >
        Empieza gratis
      </Link>
      <p className="mt-2 text-center text-xs text-[#7f92a1]">7 dias gratis · Sin tarjeta</p>
    </article>
  )
}
