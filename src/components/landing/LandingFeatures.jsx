import { motion } from 'framer-motion'
import {
  BarChart3,
  Boxes,
  CreditCard,
  FileText,
  Smartphone,
  Users,
} from 'lucide-react'
import { LandingSection } from './LandingSection'

const FEATURE_ICONS = [CreditCard, Boxes, Users, BarChart3, Smartphone, FileText]

export function LandingFeatures({ content }) {
  return (
    <LandingSection
      id="funciones"
      eyebrow={content.eyebrow}
      title={content.title}
      subtitle={content.subtitle}
      className="mt-24"
    >
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((feature, idx) => {
          const Icon = FEATURE_ICONS[idx] ?? CreditCard
          return (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-white/10 bg-[#0a0e14]/80 p-5 transition hover:border-[#00ff9f]/25 hover:shadow-[0_0_24px_rgba(0,255,159,0.08)]"
            >
              <motion.div className="inline-flex rounded-xl border border-[#00ff9f]/20 bg-[#00ff9f]/10 p-2.5 text-[#7ef4cb] transition group-hover:border-[#00ff9f]/40">
                <Icon className="h-5 w-5" />
              </motion.div>
              <h3 className="mt-4 text-base font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8fa3b0]">{feature.text}</p>
            </motion.article>
          )
        })}
      </div>
    </LandingSection>
  )
}
