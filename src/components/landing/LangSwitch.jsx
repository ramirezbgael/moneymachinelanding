import { motion } from 'framer-motion'

/**
 * @param {{ lang: 'es' | 'en', setLang: (l: 'es' | 'en') => void, label: string, variant?: 'fixed' | 'inline' }} props
 */
export function LangSwitch({ lang, setLang, label, variant = 'fixed' }) {
  const layoutId = variant === 'inline' ? 'mm-lang-inline' : 'mm-lang-fixed'
  const wrapperClass =
    variant === 'inline'
      ? 'flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0a1219]/90 px-1 py-1 backdrop-blur-sm'
      : 'fixed right-3 top-3 z-[100] flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#05070a]/80 px-1 py-1 shadow-[0_0_24px_rgba(0,0,0,0.4)] backdrop-blur-md sm:right-5 sm:top-5'

  return (
    <div className={wrapperClass} role="group" aria-label={label}>
      {['es', 'en'].map((code) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={`relative rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
              active ? 'text-[#05120c]' : 'text-[#7a8a99] hover:text-[#b8c8d4]'
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-[#00ff9f] shadow-[0_0_16px_rgba(0,255,159,0.35)]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{code}</span>
          </button>
        )
      })}
    </div>
  )
}
