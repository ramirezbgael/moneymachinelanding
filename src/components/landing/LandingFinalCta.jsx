import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function LandingFinalCta({ content }) {
  return (
    <motion.section
      id="empezar"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45 }}
      className="relative mt-24 overflow-hidden rounded-3xl border border-[#00ff9f]/25 bg-[linear-gradient(135deg,rgba(0,255,159,0.12),rgba(8,12,18,0.98))] px-6 py-12 text-center sm:px-10 sm:py-16"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,159,0.15),transparent_55%)]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <div className="relative">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">{content.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#9fb0bd] sm:text-lg">{content.subtitle}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl border border-[#00ff9f]/70 bg-[#00ff9f] px-7 py-3.5 text-sm font-semibold text-[#052014] shadow-[0_0_32px_rgba(0,255,159,0.28)] transition hover:scale-[1.01]"
          >
            {content.ctaPrimary}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-[#d2dee7] transition hover:bg-white/[0.08]"
          >
            {content.ctaSecondary}
          </a>
        </div>
        <p className="mt-5 text-xs text-[#6d8494]">{content.note}</p>
      </div>
    </motion.section>
  )
}
