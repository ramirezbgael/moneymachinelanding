import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { VerificationGateProvider } from './context/VerificationGateContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DashboardWorkspaceProvider } from './context/DashboardWorkspaceContext'
import DashboardLayout from './components/dashboard/DashboardLayout'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const PublicPage = lazy(() => import('./pages/PublicPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'))
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'))
const DashboardHomePage = lazy(() => import('./pages/dashboard/DashboardHomePage'))
const StoresPage = lazy(() => import('./pages/dashboard/StoresPage'))
const UsersPage = lazy(() => import('./pages/dashboard/UsersPage'))
const ModulesPage = lazy(() => import('./pages/dashboard/ModulesPage'))
const SubscriptionPage = lazy(() => import('./pages/dashboard/SubscriptionPage'))
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))

function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0f1419] text-sm text-[#8fa3b0]">
      <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#2a3f4f] border-t-[#7ec8ff]" aria-hidden />
      <span className="sr-only">Cargando…</span>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VerificationGateProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/public" element={<PublicPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/signup" element={<Navigate to="/register" replace />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route
                path="/onboarding"
                element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <OnboardingPage />
                    </ProtectedRoute>
                  </ErrorBoundary>
                }
              />
              <Route
                element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <DashboardWorkspaceProvider>
                        <DashboardLayout />
                      </DashboardWorkspaceProvider>
                    </ProtectedRoute>
                  </ErrorBoundary>
                }
              >
                <Route path="/dashboard" element={<DashboardHomePage />} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/modules" element={<ModulesPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </VerificationGateProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
