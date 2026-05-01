import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, Dumbbell, ShoppingBag, Sparkles, UtensilsCrossed } from 'lucide-react'
import { MarketingHeader } from '../../components/MarketingHeader'
import { LiveDashboardPreview } from '../../components/landing/LiveDashboardPreview'
import { SEO_LANDING_DATA } from '../../lib/seoLandingData'
import { getPlansByBusinessType } from '../../lib/pricingPlans'

export default function SeoMoneyLandingPage() {
  const { slug } = useParams()
  const page = slug ? SEO_LANDING_DATA[slug] : null
  const [category, setCategory] = useState('restaurant')
  const categoryPlans = useMemo(() => getPlansByBusinessType(category), [category])

  useEffect(() => {
    if (!page) return
    document.title = page.metaTitle
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', page.metaDescription)
  }, [page])

  if (!page) return <Navigate to="/soluciones" replace />

  return (
    <div className="relative overflow-x-hidden bg-[#05070a] text-[#dce3eb]">
      <MarketingHeader />
      <div className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 opacity-35" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <section className="grid gap-8 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-20">
          <div>
            <p className="inline-flex rounded-full border border-[#00ff9f]/20 bg-[#00ff9f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7af6c6]">
              BUILT FOR YOUR BUSINESS
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-6xl">
              Control your business
              <span className="block text-[#46f7b4]">like a machine</span>
            </h1>
            <p className="mt-4 text-sm text-[#8fd7b6]">SEO focus: {page.keyword}</p>
            <p className="mt-5 max-w-xl text-base text-[#a5b5c2] sm:text-lg">More sales, less friction, all from your phone.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl border border-[#00ff9f]/70 bg-transparent px-6 py-3 text-sm font-semibold text-[#9affde] transition-all duration-300 hover:bg-[#00ff9f] hover:text-[#052014] hover:shadow-[0_0_30px_rgba(0,255,159,0.3)]"
              >
                Start free
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-[#d2dee7] backdrop-blur"
              >
                Watch demo
              </a>
            </div>
            <p className="mt-5 text-xs text-[#84a0b2]">7-day trial · No card</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0d1117]/92 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <p className="text-xs text-[#8fa4b3]">Laptop dashboard</p>
            <p className="mt-1 text-3xl font-semibold text-white">MX$52,962</p>
            <p className="text-xs text-[#7bf1c5]">Sales today</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
                <p className="text-[10px] text-[#8599a8]">Orders</p>
                <p className="text-sm font-semibold text-white">37</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
                <p className="text-[10px] text-[#8599a8]">Ticket</p>
                <p className="text-sm font-semibold text-white">MX$668</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0f141b] p-3">
              <p className="text-[10px] text-[#9cb0be]">Mobile app</p>
              <div className="mt-2 space-y-1.5 text-[10px] text-[#d8e3ea]">
                <div className="flex items-center justify-between">
                  <span>Collections</span>
                  <span>MX$12,840</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Orders</span>
                  <span>9 active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cash register</span>
                  <span>Open</span>
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-[#1f6b52] bg-[#00ff9f]/15 px-2 py-1 text-center text-[10px] font-semibold text-[#9affe0]">
                Checkout ready
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            'Laptop dashboard for daily operations',
            'Mobile app for monitoring and fast checkout',
            'Live data across all your devices',
          ].map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-[#24483f] bg-[linear-gradient(140deg,rgba(0,255,159,0.1),rgba(8,12,16,0.92))] px-4 py-3"
            >
              <p className="text-sm font-semibold text-white">{item}</p>
            </article>
          ))}
        </section>

        <section id="demo" className="mt-16">
          <LiveDashboardPreview />
        </section>

        <section className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-[#00ff9f]/25 bg-[#00ff9f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8cffd3]">
              BUILT FOR YOUR BUSINESS
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
              One platform. Three industries.
              <span className="block text-[#46f7b4]">Real results.</span>
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              {
                title: 'RESTAURANTS',
                subtitle: 'Instant orders from mobile',
                bullets: ['Digital tickets', 'Fewer mistakes', 'More speed'],
                cta: 'View restaurant plans',
                Icon: UtensilsCrossed,
              },
              {
                title: 'GYMS',
                subtitle: 'Automated access and subscriptions',
                bullets: ['Automatic QR', 'Recurring payments', 'Full control'],
                cta: 'View gym plans',
                Icon: Dumbbell,
              },
              {
                title: 'COMMERCE',
                subtitle: 'Real-time sales and inventory',
                bullets: ['Fast POS', 'Live inventory', 'Customers'],
                cta: 'View commerce plans',
                Icon: ShoppingBag,
              },
            ].map((useCase) => (
              <article
                key={useCase.title}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f141b]/92 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
              >
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg border border-white/20 bg-white/10 p-1.5">
                      <useCase.Icon className="h-4 w-4 text-[#7ef4cb]" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d8e7f1]">{useCase.title}</p>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">{useCase.subtitle}</h3>
                  <ul className="mt-5 space-y-2 text-sm text-[#d1dee8]">
                    {useCase.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-[#7ef4cb]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href="#pricing"
                  className="mt-auto flex items-center justify-center gap-2 border-t border-white/[0.08] bg-black/20 px-4 py-3 text-sm font-medium text-[#e5e7eb] transition group-hover:bg-black/35"
                >
                  {useCase.cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#77f3c3]">PLANS BUILT FOR YOUR BUSINESS</p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-5xl">Choose the right plan</h2>
          </div>

          <div className="mx-auto mt-10 flex w-fit flex-wrap rounded-2xl border border-white/10 bg-[#101010]/92 p-1.5">
            {[
              { id: 'restaurant', label: 'Restaurants' },
              { id: 'retail', label: 'Commerce' },
              { id: 'gym', label: 'Gym' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={`rounded-xl px-5 py-2 text-sm transition ${
                  category === tab.id
                    ? 'border border-[#00ff9f]/40 bg-[#00ff9f]/15 text-[#99ffd8] shadow-[0_0_18px_rgba(0,255,159,0.18)]'
                    : 'border border-transparent bg-transparent text-[#9db0bf]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-[#7fdab5]">Yearly billing is cheaper in the long run.</p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryPlans.map((plan) => (
              <article key={plan.key} className="rounded-2xl border border-white/[0.08] bg-[#121212]/92 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  {plan.badge ? (
                    <span className="rounded-full border border-[#22c55e]/40 bg-[#22c55e]/15 px-2.5 py-1 text-xs font-medium text-[#92ffd6]">
                      {plan.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xl font-semibold text-[#92ffd6]">{plan.priceMonthlyLabel || plan.priceLabel}</p>
                <ul className="mt-4 space-y-2 text-sm text-[#b6c3ce]">
                  {plan.features.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00ff9f]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-[#00ff9f]/70 bg-transparent px-5 py-2.5 text-sm font-semibold text-[#9affde] transition-all duration-300 hover:bg-[#00ff9f] hover:text-[#052014] hover:shadow-[0_0_28px_rgba(0,255,159,0.28)]"
                >
                  Start free
                </Link>
                <p className="mt-2 text-center text-xs text-[#7f92a1]">7-day trial · No card</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Inventory', text: 'Never run out of stock' },
            { title: 'Customers', text: 'Sell more to existing buyers' },
            { title: 'Subscriptions', text: 'Recurring revenue without friction' },
          ].map((feature) => (
            <article
              key={feature.title}
              className="rounded-[28px] border border-[#22c55e]/30 bg-[linear-gradient(145deg,rgba(34,197,94,0.16),rgba(12,12,12,0.82))] p-4 text-center shadow-[0_0_24px_rgba(34,197,94,0.12)]"
            >
              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/12 px-2.5 py-1 text-xs text-[#9df8d2]">
                <Sparkles className="h-3.5 w-3.5" />
                Real outcome
              </div>
              <h3 className="mt-2 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-1 text-sm text-[#c9d7e1]">{feature.text}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.08] bg-[linear-gradient(180deg,#0f1218,#090b11)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-[clamp(2.4rem,9vw,6.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em] text-white">
            MONEYMACHINE
          </p>
          <p className="mt-4 max-w-md text-sm text-[#9fb2c0]">The simple way to run your business.</p>
          <div className="mt-10 border-t border-white/[0.08] pt-4 text-xs text-[#8091a0]">© 2026 MoneyMachine</div>
        </div>
      </footer>
    </div>
  )
}
