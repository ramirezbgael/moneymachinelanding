import { motion } from 'framer-motion'
import { CheckCircle2, Smartphone, Sparkles } from 'lucide-react'

export function LiveDashboardPreview() {
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
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_10%_10%,rgba(95,255,197,0.12),transparent_44%),linear-gradient(180deg,rgba(12,12,12,0.96),rgba(8,8,8,0.94))] p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_82%,rgba(95,255,197,0.09),transparent_35%)]" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/35 bg-[#22c55e]/12 px-3 py-1 text-xs font-semibold text-[#9bffd9]">
              <Sparkles className="h-3.5 w-3.5" />
              Demo multiplataforma
            </div>
            <h3 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Siempre en tus manos
              <span className="block text-[#65f4c2]">tu negocio completo</span>
            </h3>
            <p className="mt-3 max-w-lg text-sm text-[#a7bac7] sm:text-base">
              Consulta ventas, pedidos y clientes desde la laptop o el teléfono. Todo sincronizado en tiempo real, para decidir y cobrar más rápido.
            </p>

            <div className="mt-5 space-y-2">
              {[
                'Dashboard en laptop para operación diaria',
                'App móvil para monitoreo y cobros rápidos',
                'Datos en vivo en todos tus dispositivos',
              ].map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1, duration: 0.35 }}
                  className="flex items-center gap-2 text-sm text-[#cfe0ea]"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#7df3ca]" />
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <motion.div
              className="rounded-[22px] border border-white/12 bg-[#0b1118]/95 p-3 shadow-[0_18px_65px_rgba(0,0,0,0.45),0_0_30px_rgba(34,197,94,0.14)] sm:p-4"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="rounded-[16px] border border-white/10 bg-[#0e151d] p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs text-[#8ea3b1]">Dashboard en laptop</p>
                  <p className="text-xs font-semibold text-[#7ef2c8]">En vivo</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    ['Ventas hoy', '$52,180'],
                    ['Pedidos', '34'],
                    ['Ticket', '$640'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                      <p className="text-[10px] text-[#8ea2b0]">{label}</p>
                      <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <svg viewBox="0 0 300 86" className="mt-3 h-16 w-full">
                  <defs>
                    <linearGradient id="laptopLine" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(95,255,197,0.35)" />
                      <stop offset="100%" stopColor="rgba(95,255,197,1)" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0 62 L42 59 L78 44 L116 48 L152 34 L190 28 L228 34 L264 18 L300 12"
                    fill="none"
                    stroke="url(#laptopLine)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0.25, opacity: 0.75 }}
                    animate={{ pathLength: [0.25, 1, 0.9, 1], opacity: [0.75, 1, 0.9, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </svg>
              </div>
              <div className="mx-auto mt-2 h-2.5 w-[72%] rounded-full bg-[#141b23]" />
            </motion.div>

            <motion.div
              className="absolute -bottom-5 -right-2 w-[38%] min-w-[120px] rounded-[1.8rem] border border-[#2a4a43] bg-[#080d12] p-2 shadow-[0_14px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(34,197,94,0.18)]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="rounded-[1.2rem] border border-white/10 bg-[#0f151d] p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] text-[#97adbb]">App móvil</p>
                  <Smartphone className="h-3.5 w-3.5 text-[#7af1c6]" />
                </div>
                <div className="space-y-1.5">
                  {[
                    ['Cobros', '$12,840'],
                    ['Órdenes', '9 activas'],
                    ['Caja', 'Abierta'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-md bg-white/[0.03] px-2 py-1 text-[10px]">
                      <span className="text-[#a8becb]">{label}</span>
                      <span className="font-semibold text-[#e8f2f8]">{value}</span>
                    </div>
                  ))}
                </div>
                <motion.div
                  className="mt-2 rounded-md border border-[#1f6b52] bg-[#00ff9f]/15 px-2 py-1 text-center text-[10px] font-semibold text-[#9affe0]"
                  animate={{ boxShadow: ['0 0 0 rgba(0,255,159,0)', '0 0 18px rgba(0,255,159,0.28)', '0 0 0 rgba(0,255,159,0)'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Cobro listo
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
