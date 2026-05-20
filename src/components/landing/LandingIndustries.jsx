import { motion } from 'framer-motion'
import { Check, Dumbbell, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { LandingSection } from './LandingSection'

const CARD_META = {
  restaurant: {
    Icon: UtensilsCrossed,
    image: '/assets/img/resta.png',
    iconBox: 'border-[#ff9f43]/60 bg-[#ff9f43]/15 text-[#ffb870]',
    checkTone: 'text-[#ff9f43]',
    borderTone: 'border-[#5a3b2b]/80',
  },
  retail: {
    Icon: ShoppingBag,
    image: '/assets/img/store.png',
    iconBox: 'border-[#38d996]/60 bg-[#38d996]/15 text-[#52f2b1]',
    checkTone: 'text-[#38d996]',
    borderTone: 'border-[#295442]/80',
  },
  gym: {
    Icon: Dumbbell,
    image: '/assets/img/gym.png',
    iconBox: 'border-[#5d8bff]/60 bg-[#5d8bff]/15 text-[#77acff]',
    checkTone: 'text-[#5d8bff]',
    borderTone: 'border-[#2f4572]/80',
  },
}

export function LandingIndustries({ content }) {
  return (
    <LandingSection
      id="industrias"
      eyebrow={content.eyebrow}
      title={content.title}
      subtitle={content.subtitle}
      className="mt-16 sm:mt-20"
    >
      <motion.div
        className="mt-10 grid gap-5 sm:mt-12 lg:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {content.cards.map((card) => {
          const meta = CARD_META[card.id] ?? CARD_META.retail
          const { Icon } = meta
          return (
            <motion.article
              key={card.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
              }}
              whileHover={{ y: -4 }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-black ${meta.borderTone} shadow-[0_20px_50px_rgba(0,0,0,0.45)]`}
            >
              <motion.div className="relative h-52 sm:h-56 lg:h-60">
                <img
                  src={meta.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/30 to-black" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent" />
              </motion.div>

              <div className="relative flex flex-1 flex-col px-5 pb-6 pt-1 sm:px-6">
                <div
                  className={`mb-4 inline-flex w-fit rounded-xl border-2 p-2.5 ${meta.iconBox}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>

                <h3 className="text-lg font-bold uppercase tracking-[0.08em] text-white sm:text-xl">
                  {card.title}
                </h3>
                <p className="mt-2 text-base font-medium leading-snug text-[#e8eef3] sm:text-lg">
                  {card.headline}
                </p>

                <ul className="mt-5 space-y-2.5 text-sm text-[#c5d4de] sm:text-[0.9375rem]">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2.5">
                      <Check className={`h-4 w-4 shrink-0 ${meta.checkTone}`} aria-hidden />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <a
                  href="#pricing"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#9fb0bd] transition hover:text-white"
                >
                  {card.cta}
                  <span className="transition group-hover:translate-x-0.5" aria-hidden>
                    →
                  </span>
                </a>
              </div>
            </motion.article>
          )
        })}
      </motion.div>
    </LandingSection>
  )
}
