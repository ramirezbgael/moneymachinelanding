import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function HeroMorphVisual({ stages, lang }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => (s + 1) % stages.length)
    }, 3400)
    return () => clearInterval(id)
  }, [stages.length])

  const particles = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => {
        const angle = (i / 56) * Math.PI * 2
        const r = 38 + (i % 5) * 6
        return {
          id: i,
          left: 50 + Math.cos(angle) * r * 0.45,
          top: 50 + Math.sin(angle) * r * 0.48,
          delay: (i * 0.08) % 4,
          duration: 5 + (i % 4) * 1.2,
          opacity: 0.15 + (i % 5) * 0.08,
          size: i % 3 === 0 ? 3 : 2,
        }
      }),
    [],
  )

  const { Icon, label, sub } = stages[stage]

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(100%,380px)] sm:max-w-[420px]">
      <motion.div
        className="absolute inset-[8%] rounded-[40%] bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,255,159,0.14),transparent_65%)]"
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.96, 1.02, 0.96] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 rounded-[2.2rem] border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
      <motion.div
        className="pointer-events-none absolute inset-[6%] rounded-[1.8rem] border border-dashed border-[#00ff9f]/15"
        animate={{ rotate: 360 }}
        transition={{ duration: 56, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-[10%] overflow-hidden rounded-[1.6rem]">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-[#00ff9f]"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              boxShadow: '0 0 8px rgba(0,255,159,0.35)',
            }}
            animate={{
              y: [0, -10, 0],
              x: [0, 4, 0],
              opacity: [p.opacity * 0.5, p.opacity * 1.4, p.opacity * 0.5],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${lang}-${stage}-${label}`}
            initial={{ opacity: 0, scale: 0.82, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.12, filter: 'blur(14px)' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 scale-150 rounded-full bg-[#00ff9f]/25 blur-2xl" />
              <Icon
                className="relative text-[#00ff9f] drop-shadow-[0_0_28px_rgba(0,255,159,0.45)]"
                strokeWidth={1.15}
                size={112}
                aria-hidden
              />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mt-5 font-mono text-[11px] uppercase tracking-[0.35em] text-[#6ee7b7]/90"
            >
              {label}
            </motion.p>
            <p className="mt-1 text-sm text-[#8a9aaa]">{sub}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
        className="pointer-events-none absolute left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[#00ff9f]/50 to-transparent"
        animate={{ top: ['22%', '78%', '22%'] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
