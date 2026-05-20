import { motion } from 'framer-motion'
import { LandingSection } from './LandingSection'

export function LandingResults({ content }) {
  return (
    <LandingSection id="resultados" eyebrow={content.eyebrow} title={content.title} className="mt-24">
      <motion.div
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {content.items.map((item) => (
          <motion.article
            key={item.label}
            variants={{
              hidden: { opacity: 0, scale: 0.96 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
            }}
            className="rounded-2xl border border-[#24483f] bg-[linear-gradient(145deg,rgba(0,255,159,0.08),rgba(8,12,16,0.95))] p-5 text-center"
          >
            <p className="text-3xl font-semibold tracking-tight text-[#46f7b4] sm:text-4xl">{item.stat}</p>
            <p className="mt-2 text-sm font-medium text-white">{item.label}</p>
            <p className="mt-1 text-xs text-[#7a919f]">{item.note}</p>
          </motion.article>
        ))}
      </motion.div>
    </LandingSection>
  )
}
