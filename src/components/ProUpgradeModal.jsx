import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown } from 'lucide-react'
import { ModalPanel } from './Modal'
import { Button } from './dashboard/ui'

/**
 * @param {{ open: boolean, onClose: () => void, title?: string, description?: string }} props
 */
export default function ProUpgradeModal({
  open,
  onClose,
  title = 'Pásate a Pro',
  description = 'Esta función solo está disponible en el plan Pro. Mejora tu suscripción para desbloquearla.',
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="pro-upgrade"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ModalPanel>
              <div className="flex items-center gap-3 text-[#22c55e]">
                <Crown className="h-8 w-8" />
                <h2 className="text-xl font-semibold text-white">{title}</h2>
              </div>
              <p className="mt-3 text-sm text-[#94a3b8]">{description}</p>
              <div className="mt-6 flex flex-col gap-2">
                <Link to="/subscription" onClick={onClose}>
                  <Button className="w-full">Ver planes y mejorar</Button>
                </Link>
                <Button type="button" variant="secondary" className="w-full" onClick={onClose}>
                  Cerrar
                </Button>
              </div>
            </ModalPanel>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
