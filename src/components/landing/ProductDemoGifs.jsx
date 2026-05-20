import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Dumbbell, Play, ShoppingBag, UtensilsCrossed } from 'lucide-react'

const DEMO_META = {
  retail: {
    Icon: ShoppingBag,
    accent: 'text-[#52f2b1]',
    badge: 'border-[#38d996]/40 bg-[#38d996]/12 text-[#bafde0]',
    ring: 'ring-[#38d996]/20',
  },
  restaurant: {
    Icon: UtensilsCrossed,
    accent: 'text-[#ffb870]',
    badge: 'border-[#ff9f43]/40 bg-[#ff9f43]/12 text-[#ffd3a2]',
    ring: 'ring-[#ff9f43]/20',
  },
  gym: {
    Icon: Dumbbell,
    accent: 'text-[#77acff]',
    badge: 'border-[#5d8bff]/40 bg-[#5d8bff]/12 text-[#c6d8ff]',
    ring: 'ring-[#5d8bff]/20',
  },
}

function DemoVideoCard({ demo, meta, liveBadge }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const { Icon } = meta

  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return

    const start = () => {
      video.play().catch(() => {})
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start()
        } else {
          video.pause()
        }
      },
      { rootMargin: '80px', threshold: 0.15 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.article
      ref={containerRef}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
      }}
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e14] shadow-[0_20px_50px_rgba(0,0,0,0.4)] ring-1 ${meta.ring}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className={`rounded-lg border border-white/15 bg-white/5 p-1.5 ${meta.accent}`}>
            <Icon className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{demo.label}</p>
            <p className="text-xs text-[#8ea3b1]">{demo.tag}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${meta.badge}`}
        >
          <Play className="h-3 w-3" aria-hidden />
          {liveBadge}
        </span>
      </div>

      <div className="relative aspect-[4/3] bg-black sm:aspect-[16/10]">
        <video
          ref={videoRef}
          src={demo.video}
          className="absolute inset-0 h-full w-full object-contain object-top"
          poster={demo.poster}
          preload="metadata"
          autoPlay
          playsInline
          muted
          loop
          aria-label={demo.alt}
          onCanPlay={() => setLoading(false)}
          onLoadedData={() => setLoading(false)}
        />

        {loading ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#00ff9f]" />
          </div>
        ) : null}
      </div>
    </motion.article>
  )
}

export function ProductDemoGifs({ demos }) {
  return (
    <div className="space-y-8">
      {(demos.heading || demos.subheading) && (
        <div className="mx-auto max-w-2xl text-center">
          {demos.heading ? (
            <p className="text-lg font-semibold text-white sm:text-xl">{demos.heading}</p>
          ) : null}
          {demos.subheading ? (
            <p className="mt-2 text-sm text-[#9fb0bd] sm:text-base">{demos.subheading}</p>
          ) : null}
        </div>
      )}

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {demos.items.map((demo) => {
          const meta = DEMO_META[demo.id] ?? DEMO_META.retail
          return <DemoVideoCard key={demo.id} demo={demo} meta={meta} liveBadge={demos.liveBadge} />
        })}
      </motion.div>
    </div>
  )
}
