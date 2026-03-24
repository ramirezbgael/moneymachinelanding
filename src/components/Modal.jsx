import { motion } from 'framer-motion'

export function ModalBackdrop({ children, onClose }) {
  return (
    <motion.div
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex cursor-pointer items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {children}
    </motion.div>
  )
}

export function ModalPanel({ children, className = '' }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      onClick={(e) => e.stopPropagation()}
      className={`glass max-h-[90vh] w-full max-w-md cursor-default overflow-y-auto rounded-2xl border border-[#2a414f] p-6 shadow-[0_0_60px_rgba(0,255,159,0.12)] ${className}`}
    >
      {children}
    </motion.div>
  )
}
