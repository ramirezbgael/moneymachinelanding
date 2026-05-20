import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLocale } from '../i18n'
import { useAuth } from '../hooks/useAuth'
import { useCurrency } from '../lib/currency'
import { LangSwitch } from './landing/LangSwitch'

/** Cabecera pública: idioma, login/registro o panel + cerrar sesión. */
export function MarketingHeader() {
  const { lang, setLang, t } = useLocale()
  const { currency, setCurrency } = useCurrency()
  const { user, loading, signOut } = useAuth()
  const navItems = [
    { label: t.navProduct, href: '#solucion' },
    { label: t.navIndustries, href: '#industrias' },
    { label: t.navPricing, href: '#pricing' },
    { label: t.navResources, href: '/guias', isRoute: true },
    { label: t.navDemo, href: '#demos' },
  ]

  return (
    <header className="sticky top-0 z-[90] border-b border-white/[0.06] bg-[#05070a]/94 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-white sm:text-[15px]"
        >
          <img src="/icon.png" alt="MoneyMachine" className="h-7 w-7 rounded-md object-cover" />
          MoneyMachine
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            item.isRoute ? (
              <Link key={item.label} to={item.href} className="text-xs text-[#9cafbc] transition hover:text-white">
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className="text-xs text-[#9cafbc] transition hover:text-white">
                {item.label}
              </a>
            )
          ))}
        </nav>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
          <LangSwitch variant="inline" lang={lang} setLang={setLang} label={t.langSwitch} />
          <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-[#0a1219]/90 px-1 py-1 backdrop-blur-sm">
            {['MXN', 'USD'].map((code) => {
              const active = currency === code
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrency(code)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? 'border border-[#00ff9f]/65 bg-[#00ff9f]/12 text-[#9affde]'
                      : 'border border-[#00ff9f]/35 text-[#7a8a99] hover:bg-[#00ff9f] hover:text-[#05120c]'
                  }`}
                  aria-pressed={active}
                >
                  {code}
                </button>
              )
            })}
          </div>
          {!loading && user ? (
            <>
              <span
                className="hidden max-w-[140px] truncate text-xs text-[#6b7d8c] lg:inline xl:max-w-[200px]"
                title={user.email ?? ''}
              >
                {user.email}
              </span>
              <Link
                to="/dashboard"
                className="shrink-0 rounded-lg border border-[#2f4654] px-3 py-2 text-xs font-medium text-[#c2d4e0] transition-colors hover:border-[#00ff9f]/40 hover:text-white sm:text-sm"
              >
                {t.navDashboard}
              </Link>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => signOut()}
                className="shrink-0 rounded-lg bg-white/[0.07] px-3 py-2 text-xs font-medium text-[#e2eaf0] transition-colors hover:bg-white/[0.12] sm:text-sm"
              >
                {t.navSignOut}
              </motion.button>
            </>
          ) : !loading ? (
            <>
              <Link
                to="/login"
                className="shrink-0 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d5e1ea] transition hover:border-white/20 hover:text-white sm:text-sm"
              >
                {t.navLogin}
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="shrink-0">
                <Link
                  to="/register"
                  className="inline-block rounded-lg border border-[#00ff9f]/70 bg-transparent px-4 py-2 text-sm font-semibold text-[#9affde] shadow-[0_0_14px_rgba(0,255,159,0.08)] transition-all duration-300 hover:bg-[#00ff9f] hover:text-[#05120c] hover:shadow-[0_0_26px_rgba(0,255,159,0.28)]"
                >
                  {t.ctaStart}
                </Link>
              </motion.div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
