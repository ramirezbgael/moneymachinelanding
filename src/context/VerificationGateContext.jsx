/* eslint-disable react-refresh/only-export-components -- hook exportado con el provider */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, X } from 'lucide-react'
import { supabase, getAuthCallbackUrl } from '../lib/supabase'
import { getAuthEmail } from '../lib/authUtils'
import { useAuth } from '../hooks/useAuth'
import { ModalBackdrop, ModalPanel } from '../components/Modal'

const VerificationGateContext = createContext(null)

export function useVerificationGate() {
  const ctx = useContext(VerificationGateContext)
  if (!ctx) {
    throw new Error('useVerificationGate must be used within VerificationGateProvider')
  }
  return ctx
}

/**
 * @typedef {{ id: number, message: string, variant: 'success' | 'error' | 'info' }} ToastItem
 */

export function VerificationGateProvider({ children }) {
  const { user, emailConfirmed } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [toasts, setToasts] = useState(/** @type {ToastItem[]} */ ([]))
  const toastId = useRef(0)

  const pushToast = useCallback((message, variant = 'info') => {
    const id = ++toastId.current
    setToasts((prev) => [...prev, { id, message, variant }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const openVerifyModal = useCallback(() => {
    setVerifyModalOpen(true)
  }, [])

  const closeVerifyModal = useCallback(() => {
    setVerifyModalOpen(false)
  }, [])

  /**
   * Paid / sensitive actions: require signed-in + confirmed email.
   * @returns {Promise<boolean>}
   */
  const ensureVerified = useCallback(async () => {
    if (!user) {
      pushToast('Sign in to continue.', 'error')
      navigate('/login', { state: { from: location.pathname + location.search } })
      return false
    }
    if (emailConfirmed) return true
    setVerifyModalOpen(true)
    return false
  }, [user, emailConfirmed, navigate, location.pathname, location.search, pushToast])

  const resendVerificationEmail = useCallback(async () => {
    const email = getAuthEmail(user)
    if (!email) {
      pushToast('No email on this account.', 'error')
      return
    }
    setResendLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: getAuthCallbackUrl(),
        },
      })
      if (error) {
        pushToast(error.message || 'Could not resend email.', 'error')
        return
      }
      pushToast('Verification email sent. Check your inbox.', 'success')
    } catch (e) {
      pushToast(e?.message ?? 'Could not resend email.', 'error')
    } finally {
      setResendLoading(false)
    }
  }, [user, pushToast])

  const value = useMemo(
    () => ({
      ensureVerified,
      openVerifyModal,
      closeVerifyModal,
      verifyModalOpen,
      resendVerificationEmail,
      pushToast,
      dismissToast,
    }),
    [
      ensureVerified,
      openVerifyModal,
      closeVerifyModal,
      verifyModalOpen,
      resendVerificationEmail,
      pushToast,
      dismissToast,
    ],
  )

  return (
    <VerificationGateContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {verifyModalOpen && (
          <ModalBackdrop onClose={closeVerifyModal}>
            <ModalPanel className="relative">
              <button
                type="button"
                onClick={closeVerifyModal}
                className="absolute right-4 top-4 rounded-lg p-1 text-[#7a8a99] hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00ff9f]/10 text-[#00ff9f]">
                  <Mail className="h-7 w-7" />
                </div>
              </div>
              <h2 className="mt-4 text-center text-xl font-semibold text-white">
                Verify your email to unlock this feature
              </h2>
              <p className="mt-2 text-center text-sm text-[#94a3b3]">
                We sent a confirmation link when you signed up. Paid plans and saving important data
                require a verified email.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <motion.button
                  type="button"
                  disabled={resendLoading}
                  whileHover={{ scale: resendLoading ? 1 : 1.02 }}
                  whileTap={{ scale: resendLoading ? 1 : 0.98 }}
                  onClick={() => resendVerificationEmail()}
                  className="w-full rounded-xl bg-[#00ff9f] py-3 font-semibold text-[#05120c] shadow-[0_0_24px_rgba(0,255,159,0.25)] disabled:opacity-60"
                >
                  {resendLoading ? 'Sending…' : 'Resend email'}
                </motion.button>
                <button
                  type="button"
                  onClick={closeVerifyModal}
                  className="w-full rounded-xl border border-[#2a414f] py-3 text-sm font-medium text-[#b8c8d4] hover:border-[#00ff9f]/30"
                >
                  Not now
                </button>
              </div>
            </ModalPanel>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[300] flex max-w-sm flex-col gap-2 p-0 sm:bottom-6 sm:right-6"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${
                t.variant === 'error'
                  ? 'border-red-500/40 bg-red-950/90 text-red-100'
                  : t.variant === 'success'
                    ? 'border-[#00ff9f]/40 bg-[#0a1814]/95 text-[#b8ffe8]'
                    : 'border-[#2a414f] bg-[#0d141c]/95 text-[#dce3eb]'
              }`}
            >
              <p className="flex-1">{t.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </VerificationGateContext.Provider>
  )
}
