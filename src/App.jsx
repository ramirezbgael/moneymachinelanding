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
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const SolutionsIndexPage = lazy(() => import('./pages/SolutionsIndexPage'))
const GuidesIndexPage = lazy(() => import('./pages/GuidesIndexPage'))
const RestaurantsSolutionPage = lazy(() => import('./pages/solutions/RestaurantsSolutionPage'))
const RestaurantPosSystemPage = lazy(() => import('./pages/solutions/RestaurantPosSystemPage'))
const RestaurantSoftwareMexicoPage = lazy(() => import('./pages/solutions/RestaurantSoftwareMexicoPage'))
const SolutionLandingPage = lazy(() => import('./pages/solutions/SolutionLandingPage'))
const SeoMoneyLandingPage = lazy(() => import('./pages/solutions/SeoMoneyLandingPage'))
const InventoryControlGuidePage = lazy(() => import('./pages/guides/InventoryControlGuidePage'))
const PosForSmallRestaurantsGuidePage = lazy(() => import('./pages/guides/PosForSmallRestaurantsGuidePage'))
const RestaurantCashControlGuidePage = lazy(() => import('./pages/guides/RestaurantCashControlGuidePage'))
const RestaurantWasteReductionGuidePage = lazy(() => import('./pages/guides/RestaurantWasteReductionGuidePage'))
const RestaurantCheckoutSpeedGuidePage = lazy(() => import('./pages/guides/RestaurantCheckoutSpeedGuidePage'))

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
              <Route path="/soluciones" element={<SolutionsIndexPage />} />
              <Route path="/soluciones/restaurantes" element={<RestaurantsSolutionPage />} />
              <Route path="/soluciones/sistema-pos-para-restaurantes" element={<RestaurantPosSystemPage />} />
              <Route path="/soluciones/software-para-restaurantes-en-mexico" element={<RestaurantSoftwareMexicoPage />} />
              <Route path="/soluciones/landing/:slug" element={<SeoMoneyLandingPage />} />
              <Route path="/soluciones/:slug" element={<SolutionLandingPage />} />
              <Route path="/guias" element={<GuidesIndexPage />} />
              <Route path="/guias/como-controlar-inventario-negocio" element={<InventoryControlGuidePage />} />
              <Route path="/guias/pos-para-restaurantes-pequenos" element={<PosForSmallRestaurantsGuidePage />} />
              <Route path="/guias/como-llevar-control-de-caja-en-restaurante" element={<RestaurantCashControlGuidePage />} />
              <Route path="/guias/como-reducir-mermas-en-restaurante" element={<RestaurantWasteReductionGuidePage />} />
              <Route path="/guias/como-mejorar-tiempos-de-cobro-restaurante" element={<RestaurantCheckoutSpeedGuidePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
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
