import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { toDisplayMoney, useCurrency } from '../../lib/currency'

export function LandingHero({ content, isEn }) {
  const { currency } = useCurrency()
  const [heroSales, setHeroSales] = useState(52180)
  const [heroOrders, setHeroOrders] = useState(34)
  const [heroTicket, setHeroTicket] = useState(640)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSales((prev) => prev + Math.floor(Math.random() * 120 + 30))
      setHeroOrders((prev) => (prev >= 38 ? 34 : prev + 1))
      setHeroTicket((prev) => (prev >= 670 ? 640 : prev + Math.floor(Math.random() * 4 + 1)))
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  const usdRate = Number(import.meta.env.VITE_USD_MXN_RATE) > 0 ? Number(import.meta.env.VITE_USD_MXN_RATE) : 17
  const moneyLocale = isEn ? 'en-US' : 'es-MX'
  const heroSalesLabel = toDisplayMoney(heroSales, { currency, usdRate, locale: moneyLocale })
  const heroTicketLabel = toDisplayMoney(heroTicket, { currency, usdRate, locale: moneyLocale })
  const mobileCollectionsLabel = toDisplayMoney(12840, { currency, usdRate, locale: moneyLocale })
  const heroMetrics = isEn ? ['Orders', 'Ticket'] : ['Pedidos', 'Ticket']

  return (
    <section className="grid gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="inline-flex rounded-full border border-[#00ff9f]/20 bg-[#00ff9f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7af6c6]">
          {content.badge}
        </p>
        <h1 className="mt-5 text-[clamp(1.75rem,5vw,3.25rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-white">
          {content.headline}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#9fb0bd] sm:text-lg">
          {content.subheadline}
        </p>
        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#00ff9f]/70 bg-[#00ff9f] px-6 py-3.5 text-sm font-semibold text-[#052014] shadow-[0_0_28px_rgba(0,255,159,0.25)] transition hover:scale-[1.01] hover:shadow-[0_0_36px_rgba(0,255,159,0.35)]"
          >
            {content.ctaPrimary}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#demos"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-[#d2dee7] backdrop-blur transition hover:border-white/25 hover:bg-white/[0.06]"
          >
            {content.ctaSecondary}
          </a>
        </motion.div>
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
          {content.trust.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-xs text-[#84a0b2] sm:text-sm">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#5ef5b8]" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative mx-auto w-full max-w-[540px]"
        aria-label={content.visualLabel}
      >
        <motion.div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#00ff9f]/10 blur-3xl"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4.8, repeat: Infinity }}
        />
        <motion.div
          className="relative rounded-3xl border border-white/10 bg-[#0d1117]/92 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-5"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-[#6d8494]">
            {content.visualLabel}
          </p>
          <div className="grid gap-3 sm:grid-cols-[1fr_128px]">
            <div className="rounded-2xl border border-white/10 bg-[#0b0f14] p-3 sm:p-4">
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-xs text-[#8fa4b3]">{isEn ? 'Laptop dashboard' : 'Dashboard en laptop'}</p>
                <span className="rounded-full border border-[#1f6b52] bg-[#00ff9f]/10 px-2 py-0.5 text-[10px] font-semibold text-[#9affe0]">
                  {isEn ? 'Live' : 'En vivo'}
                </span>
              </motion.div>
              <motion.p
                key={heroSales}
                className="mt-1 text-3xl font-semibold text-white"
                initial={{ opacity: 0.6, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {heroSalesLabel}
              </motion.p>
              <p className="text-xs text-[#7bf1c5]">{isEn ? 'Sales today' : 'Ventas hoy'}</p>
              <svg viewBox="0 0 280 90" className="mt-3 h-20 w-full" aria-hidden>
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
                  initial={{ pathLength: 0.25 }}
                  animate={{ pathLength: [0.25, 1, 0.9, 1] }}
                  transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </svg>
              <motion.div
                className="mt-2 grid grid-cols-2 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {[
                  [heroMetrics[0], String(heroOrders)],
                  [heroMetrics[1], heroTicketLabel],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
                    <p className="text-[10px] text-[#8599a8]">{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </motion.div>
            </div>
            <div className="rounded-[1.7rem] border border-[#2b4741] bg-[#070b10] p-2">
              <div className="h-full rounded-[1.1rem] border border-white/10 bg-[#0f141b] p-2">
                <p className="text-[10px] text-[#9cb0be]">{isEn ? 'Mobile app' : 'App móvil'}</p>
                <motion.div
                  className="mt-2 space-y-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  {(isEn ? ['Collections', 'Orders', 'Register'] : ['Cobros', 'Órdenes', 'Caja']).map(
                    (item, idx) => (
                      <motion.div
                        key={item}
                        className="flex items-center justify-between text-[10px] text-[#d8e3ea]"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08 }}
                      >
                        <span>{item}</span>
                        <span>
                          {idx === 0
                            ? mobileCollectionsLabel
                            : idx === 1
                              ? isEn
                                ? '9 active'
                                : '9 activas'
                              : isEn
                                ? 'Open'
                                : 'Abierta'}
                        </span>
                      </motion.div>
                    ),
                  )}
                </motion.div>
                <div className="mt-3 rounded-lg border border-[#1f6b52] bg-[#00ff9f]/15 px-2 py-1 text-center text-[10px] font-semibold text-[#9affe0]">
                  {isEn ? 'Checkout ready' : 'Cobro listo'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
