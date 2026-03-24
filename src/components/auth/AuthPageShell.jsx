import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { LangSwitch } from '../landing/LangSwitch'
import { useLocale } from '../../i18n'

/**
 * Layout a pantalla completa: panel lateral + formulario (sin tarjeta tipo modal).
 * @param {{ mode: 'login' | 'register', children: import('react').ReactNode }} props
 */
export function AuthPageShell({ mode, children }) {
  const { lang, setLang, t } = useLocale()
  const isLogin = mode === 'login'
  const lead = isLogin ? t.authAsideLoginLead : t.authAsideRegisterLead
  const body = isLogin ? t.authAsideLoginBody : t.authAsideRegisterBody
  const bullets = t.authAsideBullets

  return (
    <div className="relative min-h-screen bg-[#030608] text-[#dce3eb]">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-[0.18]" />
      <div className="relative flex min-h-screen flex-col lg:flex-row">
        <aside className="relative flex flex-col justify-between border-b border-white/[0.06] bg-gradient-to-br from-[#062018] via-[#050d12] to-[#030608] px-8 py-10 lg:min-h-screen lg:w-[min(44%,520px)] lg:border-b-0 lg:border-r lg:border-white/[0.06] lg:px-10 lg:py-14 xl:px-14">
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Link to="/" className="text-sm font-semibold tracking-wide text-[#00ff9f]">
              MoneyMachine
            </Link>
            <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#5ee9b5]/85">
              MoneyMachine
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.15] text-white sm:text-4xl lg:text-[2.35rem]">
              {lead}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#8fa3b0]">{body}</p>
            <ul className="mt-10 space-y-3.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm leading-snug text-[#b6c9d4]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#00ff9f]/15 text-[#00ff9f]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
          <p className="mt-12 text-xs leading-relaxed text-[#4a5d6a] lg:mt-16">{t.heroTrustLine}</p>
        </aside>

        <div className="relative flex flex-1 flex-col lg:min-h-screen">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.05] bg-[#030608]/80 px-6 py-4 backdrop-blur-sm sm:px-10 lg:px-12">
            <Link
              to="/"
              className="text-sm font-medium text-[#8a9aaa] transition-colors hover:text-[#00ff9f]"
            >
              {t.authBackHome}
            </Link>
            <LangSwitch variant="inline" lang={lang} setLang={setLang} label={t.langSwitch} />
          </div>
          <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
            <motion.div
              className="mx-auto w-full max-w-lg"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.06 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
