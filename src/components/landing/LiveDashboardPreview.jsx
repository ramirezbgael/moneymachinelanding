import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, ChevronDown, Home, ShoppingCart, Users2, Wallet } from 'lucide-react'

export function LiveDashboardPreview() {
  const [sales, setSales] = useState(30198)
  const [orders, setOrders] = useState(18)
  const [ticket, setTicket] = useState(342)
  const [newClients, setNewClients] = useState(24)

  useEffect(() => {
    const timer = setInterval(() => {
      setSales((prev) => prev + Math.floor(Math.random() * 280 + 70))
      setOrders((prev) => (prev >= 26 ? 18 : prev + 1))
      setTicket((prev) => Number((prev + Math.random() * 9 + 1.5).toFixed(0)))
      setNewClients((prev) => (prev >= 42 ? 24 : prev + 1))
    }, 1400)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: [0, -4, 0] }}
      transition={{
        opacity: { duration: 0.35 },
        y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
      }}
      className="w-full rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,12,12,0.94),rgba(7,7,7,0.96))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_46px_rgba(0,255,159,0.08)] backdrop-blur-2xl sm:p-5 lg:p-6"
    >
      <div className="relative rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(95,255,197,0.08),transparent_45%)] p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#0d0d0d]/80 p-2 sm:hidden">
          {[Home, Wallet, ShoppingCart, Users2, BarChart3].map((Icon, idx) => (
            <span
              key={idx}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${
                idx === 1 ? 'border border-[#22c55e]/30 bg-[#22c55e]/12 text-[#8dffd7]' : 'text-[#95a5b0]/75'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[48px_1fr] sm:gap-4">
          <aside className="hidden rounded-xl border border-white/10 bg-[#0d0d0d]/90 p-2 sm:block">
            <div className="flex flex-col items-center gap-2.5">
              {[Home, Wallet, ShoppingCart, Users2, BarChart3].map((Icon, idx) => (
                <span
                  key={idx}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${
                    idx === 1 ? 'border border-[#22c55e]/30 bg-[#22c55e]/12 text-[#8dffd7]' : 'text-[#95a5b0]/75'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5">
              <p className="text-sm font-semibold leading-snug text-white sm:text-lg">Asi se ve tu negocio en tiempo real</p>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-xs text-[#bdd0dc] sm:px-2.5 sm:text-sm"
              >
                Hoy
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid gap-4 sm:gap-4">
              <div className="relative min-h-[176px] rounded-2xl border border-[#22c55e]/40 bg-[linear-gradient(135deg,rgba(34,197,94,0.24),rgba(14,14,14,0.96))] p-3.5 shadow-[0_12px_45px_rgba(0,0,0,0.34),0_0_35px_rgba(34,197,94,0.14)] sm:min-h-[192px] sm:p-5">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(95,255,197,0.16),transparent_45%)]" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#9ab0be] sm:text-sm">Ventas de hoy</p>
                    <motion.p
                      key={sales}
                      initial={{ opacity: 0.5, scale: 0.98 }}
                      animate={{ opacity: 1, scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.45 }}
                      className="mt-1 text-4xl font-semibold leading-none text-white sm:text-6xl"
                    >
                      ${sales.toLocaleString()}
                    </motion.p>
                  </div>
                  <motion.span
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="rounded-full border border-[#22c55e]/45 bg-[#22c55e]/30 px-2.5 py-1 text-xs font-semibold text-[#b7ffe8] shadow-[0_0_16px_rgba(34,197,94,0.35)]"
                  >
                    +12.5%
                  </motion.span>
                </div>
                <div className="mt-2 space-y-1 sm:mt-3">
                  <p className="text-xs text-[#b5c6d1]">+8 pedidos en la ultima hora</p>
                  <p className="text-xs text-[#8deec4]">Ticket promedio en aumento</p>
                </div>
                <svg viewBox="0 0 280 90" className="mt-2 h-16 w-full sm:mt-3 sm:h-20">
                  <defs>
                    <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(95,255,197,0.38)" />
                      <stop offset="100%" stopColor="rgba(95,255,197,0.98)" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0 72 L34 68 L66 54 L98 59 L132 46 L166 40 L202 49 L236 28 L280 22"
                    fill="none"
                    stroke="url(#lineGlow)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0.2, opacity: 0.75 }}
                    animate={{ pathLength: [0.2, 1, 0.9, 1], opacity: [0.75, 1, 0.9, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <g fill="rgba(95,255,197,0.6)">
                    <circle cx="34" cy="68" r="2.5" />
                    <circle cx="98" cy="59" r="2.5" />
                    <circle cx="166" cy="40" r="2.5" />
                    <circle cx="236" cy="28" r="2.5" />
                  </g>
                  <motion.circle
                    r="4"
                    fill="rgba(95,255,197,1)"
                    initial={{ cx: 34, cy: 68 }}
                    animate={{ cx: [34, 66, 98, 132, 166, 202, 236, 280], cy: [68, 54, 59, 46, 40, 49, 28, 22] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                  />
                </svg>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                <div className="group min-h-[96px] rounded-2xl border border-white/10 bg-[#101010]/92 p-3 shadow-[0_8px_28px_rgba(0,0,0,0.28)] transition hover:border-[#22c55e]/35">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[0.12em] text-[#8ca0ae]">HOY</span>
                    <ShoppingCart className="h-4 w-4 text-[#8ee8c7]" />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-sm text-[#c7d6e0]">Pedidos activos</p>
                    <motion.p key={orders} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="text-2xl font-semibold text-white">
                      {orders}
                    </motion.p>
                  </div>
                  <p className="mt-1 text-xs text-[#7ff1c6]">Ver pedidos →</p>
                </div>

                <div className="group min-h-[96px] rounded-2xl border border-white/10 bg-[#101010]/92 p-3 shadow-[0_8px_28px_rgba(0,0,0,0.28)] transition hover:border-[#22c55e]/35">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[0.12em] text-[#8ca0ae]">EN VIVO</span>
                    <Wallet className="h-4 w-4 text-[#8ee8c7]" />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-sm text-[#c7d6e0]">Ticket promedio</p>
                    <motion.p key={ticket} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="text-2xl font-semibold text-white">
                      ${ticket}
                    </motion.p>
                  </div>
                  <p className="mt-1 text-xs text-[#7ff1c6]">+8.3%</p>
                </div>

                <div className="group min-h-[96px] rounded-2xl border border-white/10 bg-[#101010]/92 p-3 shadow-[0_8px_28px_rgba(0,0,0,0.28)] transition hover:border-[#22c55e]/35 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[0.12em] text-[#8ca0ae]">HOY</span>
                    <Users2 className="h-4 w-4 text-[#8ee8c7]" />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-sm text-[#c7d6e0]">Clientes nuevos</p>
                    <motion.p key={newClients} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="text-2xl font-semibold text-white">
                      {newClients}
                    </motion.p>
                  </div>
                  <p className="mt-1 text-xs text-[#7ff1c6]">Ver clientes →</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-start gap-1 border-t border-white/[0.08] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
              <p className="text-sm text-[#6ee7b7]">Actualizado en tiempo real · Sin instalación</p>
              <p className="text-xs text-[#8ea2b2]">Actualizado hace 2 min</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
