import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, QrCode, ScanLine } from 'lucide-react'
import { useLocale } from '../i18n'
import { MarketingHeader } from '../components/MarketingHeader'
import { PricingPlansSection } from '../components/pricing/PricingPlansSection'
import { HeroMorphVisual } from '../components/landing/HeroMorphVisual'
import { FEATURE_ICONS, MORPH_ICONS } from '../components/landing/icons'

export default function LandingPage() {
  const { lang, t } = useLocale()
  const [sales, setSales] = useState(19840)
  const [cartTotal, setCartTotal] = useState(42.5)
  const [items, setItems] = useState(2)
  const [scanSuccess, setScanSuccess] = useState(false)

  const morphStages = useMemo(
    () =>
      t.heroMorph.map((s, i) => ({
        ...s,
        Icon: MORPH_ICONS[i],
      })),
    [t],
  )

  const features = useMemo(
    () =>
      t.features.map((f, i) => ({
        icon: FEATURE_ICONS[i],
        title: f.title,
        text: f.text,
      })),
    [t],
  )

  useEffect(() => {
    const salesInterval = setInterval(() => {
      setSales((prev) => prev + Math.floor(Math.random() * 30) + 10)
    }, 1200)
    const cartInterval = setInterval(() => {
      setItems((prev) => (prev >= 6 ? 2 : prev + 1))
      setCartTotal((prev) => Number((prev + Math.random() * 6 + 2).toFixed(2)))
    }, 1600)
    const scanInterval = setInterval(() => {
      setScanSuccess((prev) => !prev)
    }, 2800)
    return () => {
      clearInterval(salesInterval)
      clearInterval(cartInterval)
      clearInterval(scanInterval)
    }
  }, [])

  return (
    <div className="relative overflow-x-hidden bg-[#05070a] text-[#dce3eb]">
      <MarketingHeader />
      <div className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <motion.div
          className="absolute -top-36 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,255,159,0.2),transparent_70%)] blur-2xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.8, 0.55] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative border-b border-white/[0.06] pb-16 pt-0 sm:pb-20 lg:pb-24"
        >
          <div className="pointer-events-none absolute left-0 top-0 h-px w-24 bg-gradient-to-r from-[#00ff9f]/60 to-transparent sm:w-40" />

          <div className="flex flex-col gap-14 lg:flex-row lg:items-center lg:gap-12 xl:gap-20">
            <div className="flex-1 lg:max-w-xl xl:max-w-[28rem]">
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-[13px] font-semibold uppercase tracking-[0.38em] text-[#5ee9b5]/90 sm:text-[14px]"
              >
                MoneyMachine
              </motion.p>
              <h1 className="mt-5 text-[2.15rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                <span className="bg-gradient-to-br from-white via-white to-white/75 bg-clip-text text-transparent">
                  {t.heroTitle1}
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#b8ffe8] via-[#00ff9f] to-[#5ee9b5] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(0,255,159,0.18)]">
                  {t.heroTitle2}
                </span>
              </h1>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#94a3b3] sm:text-lg sm:leading-relaxed">
                {t.heroSubtitle}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                <motion.div
                  className="relative inline-block rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 24px rgba(0,255,159,0.35), 0 0 48px rgba(0,255,159,0.12)',
                      '0 0 36px rgba(0,255,159,0.55), 0 0 72px rgba(0,255,159,0.2)',
                      '0 0 24px rgba(0,255,159,0.35), 0 0 48px rgba(0,255,159,0.12)',
                    ],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/register"
                    className="relative inline-block rounded-full bg-[#00ff9f] px-8 py-3.5 text-sm font-semibold text-[#05120c] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                  >
                    {t.ctaStart}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <a
                    href="#pricing"
                    className="inline-block rounded-full border border-[#2a4a42]/90 bg-[#0c1210]/40 px-7 py-3 text-sm font-medium text-[#a8f5d8] backdrop-blur-sm transition-colors hover:border-[#00ff9f]/35 hover:bg-[#0f1a16]/60"
                  >
                    {t.ctaPlans}
                  </a>
                </motion.div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#94a3b3]">{t.heroMicrocopy}</p>
              <p className="mt-2 text-sm font-medium text-[#6ee7b7]/95">{t.heroTrustLine}</p>
              <p className="mt-6 font-mono text-[11px] tracking-wider text-[#5c6b78]">
                <span className="text-[#00ff9f]/70">●</span> {t.heroTags}
              </p>
            </div>

            <motion.div
              className="relative flex flex-1 justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-full max-w-[min(100%,440px)]">
                <motion.div
                  className="pointer-events-none absolute -right-4 -top-8 h-32 w-32 rounded-full bg-[#00ff9f]/10 blur-3xl sm:-right-8 sm:h-40 sm:w-40"
                  animate={{ opacity: [0.4, 0.75, 0.4] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <HeroMorphVisual key={lang} stages={morphStages} lang={lang} />
              </div>
            </motion.div>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="mt-14 rounded-3xl border border-[#1c3340] bg-[#0a1016]/80 p-6 sm:p-8"
        >
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{t.livePreview}</h2>
          <div className="mt-6 grid items-start gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="glass flex min-h-0 flex-col rounded-2xl p-5 lg:min-h-[320px]">
              <p className="shrink-0 text-sm text-[#9ab1c0]">{t.currentSale}</p>
              <div className="mt-3 flex min-h-[280px] flex-col gap-2 text-sm text-[#cee2f1] sm:min-h-[300px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-11 shrink-0"
                    aria-hidden={i >= items}
                  >
                    {i < items ? (
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex h-full items-center justify-between rounded-lg border border-[#2f4654] bg-[#0b141c]/80 px-3 py-2"
                      >
                        <span>{t.itemLine(i + 1)}</span>
                        <span>${(6.5 * (i + 1)).toFixed(2)}</span>
                      </motion.div>
                    ) : (
                      <div className="h-full rounded-lg border border-dashed border-white/[0.04] bg-white/[0.02]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="glass green-glow rounded-2xl p-5">
                <p className="text-sm text-[#9ab1c0]">{t.revenueToday}</p>
                <p className="mt-2 whitespace-nowrap text-3xl font-semibold tabular-nums text-white">
                  ${sales.toLocaleString()}
                </p>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-sm text-[#9ab1c0]">{t.cartTotal}</p>
                <p className="mt-2 whitespace-nowrap text-3xl font-semibold tabular-nums text-[#86ffcd]">
                  ${cartTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.6 }}
          className="mt-14"
        >
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{t.coreFeatures}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <motion.article
                key={feature.title}
                whileHover={{ scale: 1.03 }}
                className="glass rounded-2xl border border-[#2b404d] p-5 transition-shadow hover:shadow-[0_0_30px_rgba(0,255,159,0.18)]"
              >
                <feature.icon className="h-6 w-6 text-[#7dffd0]" />
                <h3 className="mt-3 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-[#a6b2be]">{feature.text}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="mt-14 grid gap-5 rounded-3xl border border-[#2a414f] bg-gradient-to-r from-[#091019]/85 to-[#0d1816]/80 p-6 sm:grid-cols-2 sm:p-8"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8dffd4]">{t.qrModuleLabel}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{t.qrTitle}</h2>
            <p className="mt-3 max-w-md text-[#b3bec8]">{t.qrDesc}</p>
          </div>
          <div className="glass relative overflow-hidden rounded-2xl p-6">
            <QrCode className="mx-auto h-32 w-32 text-[#78f3c4]" />
            <motion.div
              className="absolute left-0 right-0 h-1 bg-[#00ff9f]/80"
              animate={{ y: [12, 180, 12] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            />
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#a8b8c5]">
              <ScanLine className="h-4 w-4" />
              {t.qrScanning}
            </div>
            <motion.div
              animate={{ opacity: scanSuccess ? 1 : 0.4 }}
              className="mt-3 flex items-center justify-center gap-2 text-[#8fffd5]"
            >
              <CheckCircle2 className="h-5 w-5" />
              {t.qrValidated}
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mt-14"
        >
          <PricingPlansSection
            cancelUrl={
              typeof window !== 'undefined' ? `${window.location.origin}/#pricing` : undefined
            }
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mt-14 grid gap-4 sm:grid-cols-3"
        >
          {t.testimonials.map((quote) => (
            <div key={quote} className="glass rounded-xl p-4 text-sm text-[#c2cdda]">
              {quote}
            </div>
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-14 rounded-3xl border border-[#2b3f4d] bg-gradient-to-r from-[#0d1721] to-[#0f221a] p-8 text-center sm:p-12"
        >
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{t.finalCtaTitle}</h2>
          <motion.div
            className="relative mt-6 inline-block rounded-xl"
            animate={{
              boxShadow: [
                '0 0 20px rgba(0,255,159,0.3), 0 0 40px rgba(0,255,159,0.1)',
                '0 0 32px rgba(0,255,159,0.45), 0 0 56px rgba(0,255,159,0.18)',
                '0 0 20px rgba(0,255,159,0.3), 0 0 40px rgba(0,255,159,0.1)',
              ],
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/register"
              className="inline-block rounded-xl bg-[#00ff9f] px-8 py-3 font-semibold text-[#06160f]"
            >
              {t.finalCtaButton}
            </Link>
          </motion.div>
        </motion.section>

        <footer className="mt-12 border-t border-[#1f323d] py-6 text-center text-sm text-[#7f8f9d]">
          <p>{t.footer}</p>
        </footer>
      </main>
    </div>
  )
}
