import { motion } from 'framer-motion'

export function Card({ className = '', children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl border border-white/[0.08] p-5 shadow-lg shadow-black/20 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm text-[#94a3b8]">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

/** @param {{ children: import('react').ReactNode, variant?: 'primary' | 'secondary' | 'ghost', className?: string, disabled?: boolean } & import('react').ButtonHTMLAttributes<HTMLButtonElement>} props */
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50'
  const styles = {
    primary:
      'bg-[#22c55e] text-[#052e16] shadow-[0_0_24px_rgba(34,197,94,0.25)] hover:bg-[#4ade80]',
    secondary:
      'border border-white/10 bg-white/5 text-[#e2e8f0] hover:border-[#22c55e]/40 hover:bg-white/[0.07]',
    ghost: 'text-[#94a3b8] hover:bg-white/5 hover:text-white',
  }
  return (
    <button type="button" className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-white/10 bg-[#0c1016] px-4 py-2.5 text-sm text-white placeholder:text-[#64748b] outline-none transition-colors focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/30 ${className}`}
      {...props}
    />
  )
}

export function Label({ children, className = '' }) {
  return <label className={`mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#64748b] ${className}`}>{children}</label>
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full cursor-pointer rounded-xl border border-white/10 bg-[#0c1016] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#22c55e]/50 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Spinner({ className = '' }) {
  return (
    <div
      className={`h-9 w-9 animate-spin rounded-full border-2 border-[#22c55e]/25 border-t-[#22c55e] ${className}`}
      aria-hidden
    />
  )
}
