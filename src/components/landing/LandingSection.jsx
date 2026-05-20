import { motion } from 'framer-motion'

export function LandingSection({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = '',
  centered = true,
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      {(eyebrow || title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
        >
          {eyebrow ? (
            <p className="inline-flex rounded-full border border-[#00ff9f]/25 bg-[#00ff9f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8cffd3]">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? <p className="mt-4 text-base text-[#9fb0bd] sm:text-lg">{subtitle}</p> : null}
        </motion.div>
      )}
      {children}
    </section>
  )
}
