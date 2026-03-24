import { useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'
import { useLocale } from '../../i18n'
import { getStripePriceId, startStripeCheckout } from '../../lib/stripeCheckout'
import { useVerificationGate } from '../../context/VerificationGateContext'
import { useAuth } from '../../hooks/useAuth'
import { usePlan } from '../../hooks/usePlan'

/**
 * @param {{ cancelUrl?: string, className?: string }} props
 */
export function PricingPlansSection({ cancelUrl, className = '' }) {
  const { t } = useLocale()
  const { user } = useAuth()
  const { isPro: userIsPro } = usePlan()
  const { ensureVerified } = useVerificationGate()
  const [billing, setBilling] = useState(/** @type {'month' | 'year'} */ ('month'))
  const [checkoutBusyTier, setCheckoutBusyTier] = useState(/** @type {string | null} */ (null))

  const resolvedCancel =
    cancelUrl ??
    (typeof window !== 'undefined' ? `${window.location.origin}/pricing` : undefined)

  return (
    <section id="pricing" className={`scroll-mt-24 ${className}`}>
      <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">{t.pricing}</h2>
      <p className="mt-2 text-center text-sm text-[#7a8a99]">{t.pricingCurrency}</p>
      <p className="mt-1 text-center text-xs text-[#6b7a88]">{t.pricingExcludesVat}</p>
      <p className="mt-2 text-center text-sm text-[#6ee7b7]/90">{t.trialNote}</p>
      <p className="mt-3 text-center text-xs text-[#5c6d7a]">{t.billingToggleHint}</p>
      <div className="mt-4 flex flex-col items-center gap-2">
        <div
          className="inline-flex rounded-full border border-[#2d404d] bg-[#0a1219] p-1"
          role="group"
          aria-label={t.billingToggleHint}
        >
          <button
            type="button"
            onClick={() => setBilling('month')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              billing === 'month'
                ? 'bg-[#1a3d32] text-[#b8ffe8] shadow-[0_0_20px_rgba(0,255,159,0.12)]'
                : 'text-[#8a9ba8] hover:text-white'
            }`}
          >
            {t.billingToggleMonthly}
          </button>
          <button
            type="button"
            onClick={() => setBilling('year')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              billing === 'year'
                ? 'bg-[#1a3d32] text-[#b8ffe8] shadow-[0_0_20px_rgba(0,255,159,0.12)]'
                : 'text-[#8a9ba8] hover:text-white'
            }`}
          >
            {t.billingToggleYearly}
          </button>
        </div>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {t.plans.map((plan) => {
          const priceLabel =
            plan.tier === 'basic'
              ? plan.priceOneTime
              : billing === 'year'
                ? plan.priceYearly
                : plan.priceMonthly
          const isBusy = checkoutBusyTier === plan.tier
          const alreadyPro = Boolean(user) && userIsPro && (plan.tier === 'pro' || plan.tier === 'business')
          return (
            <motion.article
              key={plan.tier}
              whileHover={{ y: -6 }}
              className={`glass rounded-2xl p-6 ${plan.featured ? 'scale-[1.02] border-[#58cfa2] green-glow' : 'border-[#2d404d]'}`}
            >
              <p className="text-sm tracking-[0.2em] text-[#9cb5c4]">{plan.name}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{priceLabel}</p>
              {plan.tier !== 'basic' && (
                <p className="mt-1 text-xs text-[#6b7d8c]">
                  {billing === 'year' ? t.billingToggleYearly : t.billingToggleMonthly}
                </p>
              )}
              <ul className="mt-4 space-y-2 text-sm text-[#b6c4d0]">
                {plan.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 shrink-0 text-[#84ffd1]" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isBusy || alreadyPro}
                onClick={async () => {
                  if (alreadyPro) return
                  const ok = await ensureVerified()
                  if (!ok) return
                  setCheckoutBusyTier(plan.tier)
                  const interval = plan.tier === 'basic' ? 'month' : billing
                  const priceId = getStripePriceId(
                    plan.tier,
                    interval === 'year' ? 'year' : 'month',
                  )
                  const mode = plan.tier === 'basic' ? 'payment' : 'subscription'
                  const result = await startStripeCheckout({
                    priceId,
                    mode,
                    cancelUrl: resolvedCancel,
                    planTier: plan.tier === 'business' ? 'business' : 'pro',
                  })
                  setCheckoutBusyTier(null)
                  if (!result.ok) {
                    window.alert(`${t.checkoutErrorTitle}\n\n${result.message || result.error}`)
                  }
                }}
                className="mt-6 w-full rounded-xl border border-[#2d5a48] bg-[#0f241c] py-3 text-sm font-semibold text-[#b8ffe8] transition-colors hover:bg-[#153028] disabled:opacity-50"
              >
                {alreadyPro
                  ? 'Ya tienes plan Pro'
                  : isBusy
                    ? t.checkoutLoading
                    : plan.tier === 'basic'
                      ? t.checkoutBuy
                      : t.checkoutSubscribe}
              </button>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
