import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { VerificationGateProvider } from './context/VerificationGateContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import PublicPage from './pages/PublicPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import { DashboardWorkspaceProvider } from './context/DashboardWorkspaceContext'
import DashboardLayout from './components/dashboard/DashboardLayout'
import DashboardHomePage from './pages/dashboard/DashboardHomePage'
import StoresPage from './pages/dashboard/StoresPage'
import UsersPage from './pages/dashboard/UsersPage'
import ModulesPage from './pages/dashboard/ModulesPage'
import SubscriptionPage from './pages/dashboard/SubscriptionPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import PricingPage from './pages/PricingPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VerificationGateProvider>
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
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              element={
                <ProtectedRoute>
                  <DashboardWorkspaceProvider>
                    <DashboardLayout />
                  </DashboardWorkspaceProvider>
                </ProtectedRoute>
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
        </VerificationGateProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
