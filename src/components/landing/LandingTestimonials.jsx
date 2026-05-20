import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { LandingSection } from './LandingSection'

export function LandingTestimonials({ content }) {
  return (
    <LandingSection
      id="testimonios"
      eyebrow={content.eyebrow}
      title={content.title}
      subtitle={content.subtitle}
      className="mt-24"
    >
      <motion.div className="mt-12 grid gap-5 md:grid-cols-3">
        {content.items.map((item, idx) => (
          <motion.blockquote
            key={item.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#0a0e14]/90 p-6"
          >
            <Quote className="h-8 w-8 text-[#00ff9f]/40" aria-hidden />
            <p className="mt-4 flex-1 text-sm leading-relaxed text-[#c5d4de]">&ldquo;{item.quote}&rdquo;</p>
            <footer className="mt-6 border-t border-white/[0.06] pt-4">
              <p className="text-sm font-semibold text-white">{item.name}</p>
              <p className="mt-0.5 text-xs text-[#7a919f]">{item.role}</p>
            </footer>
          </motion.blockquote>
        ))}
      </motion.div>
    </LandingSection>
  )
}
