import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { MarketingHeader } from '../components/MarketingHeader'
import { LandingFinalCta } from '../components/landing/LandingFinalCta'
import { LandingFeatures } from '../components/landing/LandingFeatures'
import { LandingHero } from '../components/landing/LandingHero'
import { LandingIndustries } from '../components/landing/LandingIndustries'
import { LandingPainPoints } from '../components/landing/LandingPainPoints'
import { LandingResults } from '../components/landing/LandingResults'
import { LandingSection } from '../components/landing/LandingSection'
import { LandingSolution } from '../components/landing/LandingSolution'
import { LandingTestimonials } from '../components/landing/LandingTestimonials'
import { LiveDashboardPreview } from '../components/landing/LiveDashboardPreview'
import { ProductDemoGifs } from '../components/landing/ProductDemoGifs'
import { useLocale } from '../i18n'
import { convertPriceLabelFromMxn, useCurrency } from '../lib/currency'
import { getLandingContent } from '../lib/landingContent'
import { getPlansByBusinessType } from '../lib/pricingPlans'

export default function LandingPage() {
  const { lang } = useLocale()
  const isEn = lang === 'en'
  const copy = useMemo(() => getLandingContent(isEn), [isEn])
  const [category, setCategory] = useState('restaurant')
  const [billingCycle, setBillingCycle] = useState('monthly')
  const { currency } = useCurrency()

  const categoryPlans = useMemo(() => getPlansByBusinessType(category), [category])
  const localizedPlans = useMemo(
    () => localizePlans(categoryPlans, { currency, isEn }),
    [categoryPlans, currency, isEn],
  )

  const categoryTitle = copy.pricing.categoryLabel(category)

  return (
    <div className="relative overflow-x-hidden bg-[#05070a] text-[#dce3eb]">
      <MarketingHeader />
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid-bg absolute inset-0 opacity-40" />
        <motion.div
          className="absolute -top-36 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,255,159,0.18),transparent_70%)] blur-2xl"
          animate={{ scale: [1, 1.06, 1], opacity: [0.45, 0.75, 0.45] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        />
      </motion.div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <LandingHero content={copy.hero} isEn={isEn} />

        <section id="demos" className="mt-10 scroll-mt-24 sm:mt-14">
          <ProductDemoGifs demos={copy.product.demos} />
        </section>

        <LandingPainPoints content={copy.pain} />
        <LandingIndustries content={copy.industries} isEn={isEn} />
        <LandingSolution content={copy.solution} />

        <LandingSection
          id="demo"
          eyebrow={copy.product.eyebrow}
          title={copy.product.title}
          subtitle={copy.product.subtitle}
          className="mt-24"
        >
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
          >
            <LiveDashboardPreview />
          </motion.div>
        </LandingSection>

        <LandingFeatures content={copy.features} />
        <LandingResults content={copy.results} />
        <LandingTestimonials content={copy.testimonials} />

        <section id="pricing" className="mt-24 scroll-mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-[#00ff9f]/25 bg-[#00ff9f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8cffd3]">
              {copy.pricing.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              {copy.pricing.title}
              <span className="mt-1 block text-[#46f7b4]">
                {isEn ? `for ${categoryTitle}` : `para ${categoryTitle}`}
              </span>
            </h2>
          </div>

          <div className="mx-auto mt-10 flex w-fit flex-wrap rounded-2xl border border-white/10 bg-[#101010]/92 p-1.5">
            {copy.pricing.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={`rounded-xl px-5 py-2 text-sm transition ${
                  category === tab.id
                    ? 'border border-[#00ff9f]/40 bg-[#00ff9f]/15 text-[#99ffd8] shadow-[0_0_18px_rgba(0,255,159,0.18)]'
                    : 'border border-transparent text-[#9db0bf] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-col items-center gap-2">
            <motion.div
              className="flex w-fit items-center rounded-2xl border border-white/10 bg-[#101010]/92 p-1.5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {copy.pricing.cycles.map((cycle) => (
                <button
                  key={cycle.id}
                  type="button"
                  onClick={() => setBillingCycle(cycle.id)}
                  className={`rounded-xl px-4 py-2 text-sm transition ${
                    billingCycle === cycle.id
                      ? 'border border-[#00ff9f]/40 bg-[#00ff9f]/15 text-[#99ffd8]'
                      : 'border border-transparent text-[#9db0bf] hover:text-white'
                  }`}
                >
                  {cycle.label}
                </button>
              ))}
            </motion.div>
            <p className="text-xs text-[#7fdab5]">{copy.pricing.yearlyHint}</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localizedPlans.map((plan) => (
              <PricingCard
                key={plan.key}
                name={plan.name}
                price={
                  billingCycle === 'yearly' && plan.priceYearlyLabel
                    ? plan.priceYearlyLabel
                    : plan.priceMonthlyLabel || plan.priceLabel
                }
                bullets={plan.features}
                highlight={plan.key === 'pro'}
                badge={plan.badge ?? ''}
                lang={lang}
                billingCycle={billingCycle}
                hasYearly={Boolean(plan.priceYearlyLabel)}
              />
            ))}
          </div>
        </section>

        <LandingFinalCta content={copy.finalCta} />
      </main>

      <footer className="relative z-10 border-t border-white/[0.08] bg-[linear-gradient(180deg,#0f1218,#090b11)]">
        <motion.div
          className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end">
            <motion.div whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 300 }}>
              <p className="text-[clamp(2rem,8vw,5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em] text-white">
                MoneyMachine
              </p>
              <p className="mt-4 max-w-md text-sm text-[#9fb2c0]">{copy.footer.tagline}</p>
            </motion.div>
            <div className="grid grid-cols-2 gap-6 text-sm text-[#a8bac7] sm:grid-cols-3">
              <motion.div className="space-y-2" whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 300 }}>
                <a href="#solucion" className="block hover:text-white">
                  {copy.footer.links.product}
                </a>
                <a href="#problemas" className="block hover:text-white">
                  {copy.footer.links.problems}
                </a>
                <a href="#funciones" className="block hover:text-white">
                  {copy.footer.links.features}
                </a>
                <a href="#pricing" className="block hover:text-white">
                  {copy.footer.links.pricing}
                </a>
                <a href="#demo" className="block hover:text-white">
                  {copy.footer.links.demo}
                </a>
                <Link to="/soluciones" className="block hover:text-white">
                  {copy.footer.links.solutions}
                </Link>
              </motion.div>
              <div className="space-y-2">
                <a href="#pricing" className="block hover:text-white">
                  {copy.footer.links.restaurants}
                </a>
                <a href="#pricing" className="block hover:text-white">
                  {copy.footer.links.gyms}
                </a>
                <Link to="/soluciones/comercios" className="block hover:text-white">
                  {copy.footer.links.retail}
                </Link>
                <Link to="/guias" className="block hover:text-white">
                  {copy.footer.links.guides}
                </Link>
              </div>
              <div className="space-y-2">
                <a href="/terms" className="block hover:text-white">
                  {copy.footer.links.terms}
                </a>
                <a href="/privacy" className="block hover:text-white">
                  {copy.footer.links.privacy}
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-white/[0.08] pt-4 text-xs text-[#8091a0]">© 2026 MoneyMachine</div>
        </motion.div>
      </footer>
    </div>
  )
}

function localizePlans(categoryPlans, { currency, isEn }) {
  const usdRate = Number(import.meta.env.VITE_USD_MXN_RATE) > 0 ? Number(import.meta.env.VITE_USD_MXN_RATE) : 17

  const translateFeature = (text) =>
    ({
      '1 dispositivo': '1 device',
      'TPV basico': 'Basic POS',
      'Comandas con meseros desde celular': 'Waiter mobile ordering',
      'Multi dispositivo': 'Multi device',
      'Control total de operaciones': 'Full operations control',
      'Todo lo anterior': 'Everything above',
      'Autofacturacion por comensal (QR en mesa)': 'Self-invoicing per guest (table QR)',
      'Menos carga operativa': 'Lower operational load',
      TPV: 'POS',
      Inventario: 'Inventory',
      Clientes: 'Customers',
      'Facturacion electronica (proximamente)': 'E-invoicing (coming soon)',
      Suscripciones: 'Subscriptions',
      'Acceso con QR': 'QR access',
      'Control de asistencia': 'Attendance control',
    })[text] ?? text

  const translateName = (name) =>
    ({
      'Commerce Basico': 'Commerce Basic',
    })[name] ?? name

  const translateBadge = (badge) =>
    ({
      'Mas popular': 'Most popular',
      Proximamente: 'Coming soon',
    })[badge] ?? badge

  return categoryPlans.map((plan) => {
    const monthlyBase = currency === 'USD' && plan.priceMonthlyUsdLabel ? plan.priceMonthlyUsdLabel : plan.priceMonthlyLabel
    const yearlyBase = currency === 'USD' && plan.priceYearlyUsdLabel ? plan.priceYearlyUsdLabel : plan.priceYearlyLabel

    return {
      ...plan,
      name: isEn ? translateName(plan.name) : plan.name,
      badge: isEn && plan.badge ? translateBadge(plan.badge) : plan.badge,
      priceLabel: convertPriceLabelFromMxn(plan.priceLabel, {
        currency,
        usdRate,
        locale: isEn ? 'en-US' : 'es-MX',
      }),
      priceMonthlyLabel: monthlyBase
        ? convertPriceLabelFromMxn(monthlyBase, { currency, usdRate, locale: isEn ? 'en-US' : 'es-MX' })
        : '',
      priceYearlyLabel: yearlyBase
        ? convertPriceLabelFromMxn(yearlyBase, { currency, usdRate, locale: isEn ? 'en-US' : 'es-MX' })
        : '',
      features: isEn ? plan.features.map(translateFeature) : plan.features,
    }
  })
}

function PricingCard({
  name,
  price,
  bullets,
  highlight = false,
  badge = '',
  lang = 'es',
  billingCycle = 'monthly',
  hasYearly = false,
}) {
  const isEn = lang === 'en'
  return (
    <article
      className={`rounded-2xl border p-5 backdrop-blur-xl ${
        highlight
          ? 'border-[#22c55e]/40 bg-gradient-to-br from-[#121212]/95 via-[#101010]/95 to-[#0e1a12]/92 shadow-[0_0_40px_rgba(34,197,94,0.12)]'
          : 'border-white/[0.08] bg-[#121212]/92'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        {badge ? (
          <span className="rounded-full border border-[#22c55e]/40 bg-[#22c55e]/15 px-2.5 py-1 text-xs font-medium text-[#92ffd6]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xl font-semibold text-[#92ffd6]">{price}</p>
      {billingCycle === 'yearly' && hasYearly ? (
        <p className="mt-1 text-xs text-[#7fdab5]">
          {isEn ? 'Better long-term value' : 'Mejor precio a largo plazo'}
        </p>
      ) : null}
      <ul className="mt-4 space-y-2 text-sm text-[#b6c3ce]">
        {bullets.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00ff9f]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/register"
        className={`mt-5 inline-flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
          highlight
            ? 'border border-[#00ff9f]/70 bg-transparent text-[#9affde] hover:bg-[#00ff9f] hover:text-[#062016]'
            : 'border border-white/15 bg-white/[0.02] text-[#d9e6ee] hover:border-[#00ff9f]/35'
        }`}
      >
        {isEn ? 'Start free' : 'Empieza gratis'}
      </Link>
      <p className="mt-2 text-center text-xs text-[#7f92a1]">
        {isEn ? '7-day trial · No card' : '7 días gratis · Sin tarjeta'}
      </p>
    </article>
  )
}
