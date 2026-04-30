import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLocale } from '../i18n'
import { useAuth } from '../hooks/useAuth'
import { LangSwitch } from './landing/LangSwitch'

/** Cabecera pública: idioma, login/registro o panel + cerrar sesión. */
export function MarketingHeader() {
  const { lang, setLang, t } = useLocale()
  const { user, loading, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-[90] border-b border-white/[0.06] bg-[#05070a]/94 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[#00ff9f] sm:text-[15px]"
        >
          <img src="/icon.png" alt="MoneyMachine" className="h-7 w-7 rounded-md object-cover" />
          MoneyMachine
        </Link>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
          <LangSwitch variant="inline" lang={lang} setLang={setLang} label={t.langSwitch} />
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
                className="shrink-0 text-sm font-medium text-[#8a9aaa] transition-colors hover:text-[#00ff9f]"
              >
                {t.navLogin}
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="shrink-0">
                <Link
                  to="/register"
                  className="inline-block rounded-lg bg-[#00ff9f] px-4 py-2 text-sm font-semibold text-[#05120c] shadow-[0_0_20px_rgba(0,255,159,0.2)]"
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
