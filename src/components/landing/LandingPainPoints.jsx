import { motion } from 'framer-motion'
import { AlertTriangle, Dumbbell, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { LandingSection } from './LandingSection'

const ICONS = {
  restaurant: UtensilsCrossed,
  retail: ShoppingBag,
  gym: Dumbbell,
}

const TONES = {
  restaurant: {
    border: 'border-[#5a3b2b]',
    icon: 'text-[#ffb870]',
    glow: 'bg-[#ff9f43]/20',
  },
  retail: {
    border: 'border-[#295442]',
    icon: 'text-[#52f2b1]',
    glow: 'bg-[#38d996]/20',
  },
  gym: {
    border: 'border-[#2f4572]',
    icon: 'text-[#77acff]',
    glow: 'bg-[#5d8bff]/20',
  },
}

export function LandingPainPoints({ content }) {
  return (
    <LandingSection
      id="problemas"
      eyebrow={content.eyebrow}
      title={content.title}
      subtitle={content.subtitle}
      className="mt-20"
    >
      <motion.div
        className="mt-12 grid gap-5 lg:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {content.segments.map((segment) => {
          const Icon = ICONS[segment.id] ?? AlertTriangle
          const tone = TONES[segment.id] ?? TONES.retail
          return (
            <motion.article
              key={segment.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className={`relative overflow-hidden rounded-2xl border bg-[#0a0e14]/90 p-6 ${tone.border}`}
            >
              <motion.div
                className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl ${tone.glow}`}
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div className={`rounded-lg border border-white/15 bg-white/5 p-2 ${tone.icon}`}>
                  <Icon className="h-4 w-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white">{segment.title}</h3>
              </motion.div>
              <ul className="relative mt-5 space-y-4">
                {segment.pains.map((pain) => (
                  <li key={pain.title} className="border-t border-white/[0.06] pt-4 first:border-0 first:pt-0">
                    <p className="flex items-start gap-2 text-sm font-semibold text-[#e8f0f5]">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e6e]" />
                      {pain.title}
                    </p>
                    <p className="mt-1.5 pl-6 text-sm leading-relaxed text-[#8fa3b0]">{pain.text}</p>
                  </li>
                ))}
              </ul>
            </motion.article>
          )
        })}
      </motion.div>
    </LandingSection>
  )
}
