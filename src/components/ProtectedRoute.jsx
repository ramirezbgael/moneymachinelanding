import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { EmailVerificationBanner } from './EmailVerificationBanner'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070a] text-[#8a9aaa]">
        <div className="h-8 w-8 animate-pulse rounded-full border-2 border-[#00ff9f]/40 border-t-[#00ff9f]" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  }

  return (
    <>
      <EmailVerificationBanner />
      {children}
    </>
  )
}
