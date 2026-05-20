import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowRightLeft } from 'lucide-react'
import { LandingSection } from './LandingSection'

export function LandingSolution({ content }) {
  return (
    <LandingSection
      id="solucion"
      eyebrow={content.eyebrow}
      title={content.title}
      subtitle={content.subtitle}
      className="mt-24"
    >
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {content.items.map((item, idx) => (
          <motion.article
            key={item.problem}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5"
          >
            <motion.div
              className="flex flex-wrap items-center gap-2 text-sm"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <span className="rounded-lg border border-[#f87171]/30 bg-[#f87171]/10 px-2.5 py-1 font-medium text-[#fca5a5]">
                {item.problem}
              </span>
              <ArrowRightLeft className="h-4 w-4 text-[#6b8494]" />
              <span className="rounded-lg border border-[#00ff9f]/35 bg-[#00ff9f]/10 px-2.5 py-1 font-semibold text-[#9affe0]">
                {item.solution}
              </span>
            </motion.div>
            <p className="mt-4 text-sm leading-relaxed text-[#a5b8c5]">{item.text}</p>
          </motion.article>
        ))}
      </div>
      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-xl border border-[#00ff9f]/50 bg-[#00ff9f]/10 px-6 py-3 text-sm font-semibold text-[#9affe0] transition hover:bg-[#00ff9f] hover:text-[#052014]"
        >
          {content.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </LandingSection>
  )
}
