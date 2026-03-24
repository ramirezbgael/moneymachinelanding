import { useEffect, useState } from 'react'

export const LANG_STORAGE_KEY = 'mm-lang'

/** @typedef {'es' | 'en'} Lang */

export const STRINGS = {
  es: {
    langSwitch: 'Idioma',
    heroMorph: [
      { label: 'Dinero', sub: 'Flujo de ingresos' },
      { label: 'Stock', sub: 'Inventario vivo' },
      { label: 'Control', sub: 'Operación en consola' },
      { label: 'Pago', sub: 'Cobro unificado' },
    ],
    heroTitle1: 'Controla tu negocio',
    heroTitle2: 'como una máquina',
    heroSubtitle:
      'Ventas, inventario, clientes y acceso con suscripciones en un solo sistema potente',
    heroMicrocopy: 'Configura tu negocio en menos de 2 minutos',
    heroTrustLine: 'Prueba gratis 7 días · Sin tarjeta de crédito',
    navLogin: 'Iniciar sesión',
    navDashboard: 'Ir al panel',
    navSignOut: 'Cerrar sesión',
    authBackHome: '← Inicio',
    authAsideLoginLead: 'Bienvenido de nuevo',
    authAsideLoginBody:
      'Tu operación en un solo lugar: ventas, inventario, clientes y suscripciones.',
    authAsideRegisterLead: 'Únete a MoneyMachine',
    authAsideRegisterBody:
      'Prueba gratis 7 días sin tarjeta. Configura tu negocio en minutos y entra al panel.',
    authAsideBullets: [
      'Prueba gratis · sin tarjeta',
      'Sincronización en la nube',
      'De MXN · precios claros',
    ],
    authLoginTitle: 'Iniciar sesión',
    authLoginSubtitle: 'Introduce tu correo y contraseña',
    authRegisterTitle: 'Crear cuenta',
    authRegisterSubtitle: 'Prueba gratis 7 días · Sin tarjeta de crédito',
    authEmail: 'Correo electrónico',
    authPassword: 'Contraseña',
    authNameOptional: 'Nombre (opcional)',
    authSignIn: 'Entrar',
    authSigningIn: 'Entrando…',
    authCreateAccount: 'Crear cuenta',
    authCreating: 'Creando cuenta…',
    authHasAccount: '¿Ya tienes cuenta?',
    authNoAccount: '¿No tienes cuenta?',
    authGoRegister: 'Regístrate gratis',
    authGoLogin: 'Iniciar sesión',
    authForgotPasswordLink: '¿Olvidaste tu contraseña?',
    authForgotPasswordTitle: 'Recuperar contraseña',
    authForgotPasswordSubtitle: 'Indica tu correo y te enviaremos un enlace para elegir una nueva contraseña.',
    authForgotPasswordSubmit: 'Enviar enlace',
    authForgotPasswordSending: 'Enviando…',
    authForgotPasswordSuccess:
      'Si hay una cuenta con ese correo, recibirás un enlace en unos minutos. Revisa la carpeta de spam.',
    authForgotPasswordBackLogin: 'Volver a iniciar sesión',
    authResetPasswordTitle: 'Nueva contraseña',
    authResetPasswordSubtitle: 'Elige una contraseña segura para tu cuenta.',
    authResetPasswordNew: 'Nueva contraseña',
    authResetPasswordConfirm: 'Confirmar contraseña',
    authResetPasswordSubmit: 'Guardar contraseña',
    authResetPasswordSaving: 'Guardando…',
    authResetPasswordMismatch: 'Las contraseñas no coinciden.',
    authResetPasswordTooShort: 'Mínimo 6 caracteres.',
    authResetPasswordDone: 'Contraseña actualizada. Ya puedes iniciar sesión.',
    authResetPasswordInvalidLink:
      'Este enlace no es válido o ha caducado. Solicita uno nuevo desde “Olvidé mi contraseña”.',
    authResetPasswordLoading: 'Validando enlace…',
    authLoginAfterReset: 'Tu contraseña se actualizó correctamente.',
    ctaStart: 'Empieza gratis',
    ctaPlans: 'Ver planes',
    trialNote: 'Prueba gratis 7 días · Sin tarjeta de crédito',
    heroTags: 'TPV · Inventario · CRM · Suscripciones',
    livePreview: 'Vista en vivo',
    currentSale: 'Venta actual',
    itemLine: (n) => `Artículo #${n}`,
    revenueToday: 'Ingresos hoy',
    cartTotal: 'Total carrito',
    coreFeatures: 'Funciones clave',
    features: [
      {
        title: 'Punto de venta',
        text: 'Cobra más rápido, sin fricción.',
      },
      {
        title: 'Inventario',
        text: 'Sabe qué tienes y qué debes reponer.',
      },
      {
        title: 'Clientes',
        text: 'Conoce hábitos para vender mejor.',
      },
      {
        title: 'Finanzas',
        text: 'Ve ingresos y gastos en segundos.',
      },
      {
        title: 'Ventas pendientes',
        text: 'Pedidos y cobros por cerrar, siempre a la vista.',
      },
      {
        title: 'Suscripciones',
        text: 'Gestiona membresías sin hojas de cálculo.',
      },
      {
        title: 'Acceso con suscripciones',
        text: 'QR y validación ligados a suscripciones activas.',
      },
    ],
    qrModuleLabel: 'Acceso con suscripciones',
    qrTitle: 'Suscripción activa. Acceso listo.',
    qrDesc:
      'Quien tiene suscripción vigente obtiene un código único. Valida entradas, lleva asistencia y automatiza el acceso.',
    qrScanning: 'Validando código de suscriptor…',
    qrValidated: 'Acceso validado',
    pricing: 'Precios',
    pricingCurrency: 'Precios en pesos mexicanos (MXN).',
    pricingExcludesVat: 'Los precios no incluyen IVA.',
    billingToggleMonthly: 'Mensual',
    billingToggleYearly: 'Anual',
    billingToggleHint: 'Pro y Business: elige facturación mensual o anual.',
    checkoutSubscribe: 'Suscribirme',
    checkoutBuy: 'Comprar',
    checkoutLoading: 'Abriendo pago…',
    checkoutErrorTitle: 'No se pudo abrir el pago',
    plans: [
      {
        tier: 'basic',
        name: 'BÁSICO',
        priceOneTime: '$1,499 MXN pago único',
        bullets: ['TPV', 'Inventario', 'Clientes', 'Un solo dispositivo'],
      },
      {
        tier: 'pro',
        name: 'PRO',
        priceMonthly: '$149 MXN / mes',
        priceYearly: '$1,499 MXN / año',
        bullets: [
          'Todo lo del Básico',
          'Finanzas',
          'Ventas pendientes',
          'Varios dispositivos',
          'Sincronización en la nube',
        ],
        featured: true,
      },
      {
        tier: 'business',
        name: 'BUSINESS',
        priceMonthly: '$249 MXN / mes',
        priceYearly: '$2,499 MXN / año',
        bullets: [
          'Todo lo del Pro',
          'Suscripciones',
          'Acceso con suscripciones',
          'Seguimiento de asistencia',
        ],
      },
    ],
    testimonials: [
      '"Reemplazamos 4 herramientas por una. El día a día por fin está bajo control."',
      '"La capacitación del equipo fue más rápida y desaparecieron errores de cobro."',
      '"Automatizar el acceso por suscripción nos ahorró horas cada semana."',
    ],
    finalCtaTitle: 'Deja de adivinar. Empieza a controlar.',
    finalCtaButton: 'Empieza gratis',
    footer: 'MoneyMachine — Hecho para operadores modernos.',
  },
  en: {
    langSwitch: 'Language',
    heroMorph: [
      { label: 'Money', sub: 'Revenue flow' },
      { label: 'Stock', sub: 'Live inventory' },
      { label: 'Control', sub: 'Console operations' },
      { label: 'Pay', sub: 'Unified checkout' },
    ],
    heroTitle1: 'Control your business',
    heroTitle2: 'like a machine',
    navLogin: 'Log in',
    navDashboard: 'Dashboard',
    navSignOut: 'Sign out',
    authBackHome: '← Home',
    authAsideLoginLead: 'Welcome back',
    authAsideLoginBody:
      'Run sales, inventory, customers, and subscriptions from one powerful dashboard.',
    authAsideRegisterLead: 'Join MoneyMachine',
    authAsideRegisterBody:
      'Start your 7-day free trial—no card required. Set up in minutes and open your dashboard.',
    authAsideBullets: [
      'Free trial · no card',
      'Cloud sync',
      'Pricing in MXN',
    ],
    authLoginTitle: 'Log in',
    authLoginSubtitle: 'Enter your email and password',
    authRegisterTitle: 'Create account',
    authRegisterSubtitle: '7-day free trial · No credit card required',
    authEmail: 'Email',
    authPassword: 'Password',
    authNameOptional: 'Name (optional)',
    authSignIn: 'Sign in',
    authSigningIn: 'Signing in…',
    authCreateAccount: 'Create account',
    authCreating: 'Creating account…',
    authHasAccount: 'Already have an account?',
    authNoAccount: 'New here?',
    authGoRegister: 'Start free trial',
    authGoLogin: 'Log in',
    authForgotPasswordLink: 'Forgot your password?',
    authForgotPasswordTitle: 'Reset password',
    authForgotPasswordSubtitle: "Enter your email and we'll send you a link to set a new password.",
    authForgotPasswordSubmit: 'Send reset link',
    authForgotPasswordSending: 'Sending…',
    authForgotPasswordSuccess:
      'If an account exists for that email, you’ll receive a link shortly. Check spam folder.',
    authForgotPasswordBackLogin: 'Back to log in',
    authResetPasswordTitle: 'New password',
    authResetPasswordSubtitle: 'Choose a strong password for your account.',
    authResetPasswordNew: 'New password',
    authResetPasswordConfirm: 'Confirm password',
    authResetPasswordSubmit: 'Save password',
    authResetPasswordSaving: 'Saving…',
    authResetPasswordMismatch: 'Passwords do not match.',
    authResetPasswordTooShort: 'At least 6 characters.',
    authResetPasswordDone: 'Password updated. You can sign in now.',
    authResetPasswordInvalidLink:
      'This link is invalid or has expired. Request a new one from “Forgot your password”.',
    authResetPasswordLoading: 'Verifying link…',
    authLoginAfterReset: 'Your password was updated successfully.',
    heroSubtitle:
      'Sales, inventory, customers, and subscription-based access in one system',
    heroMicrocopy: 'Set up your business in under 2 minutes',
    heroTrustLine: '7-day free trial · No credit card required',
    ctaStart: 'Start free',
    ctaPlans: 'View plans',
    trialNote: '7-day free trial · No credit card required',
    heroTags: 'POS · Inventory · CRM · Subscriptions',
    livePreview: 'Live preview',
    currentSale: 'Current sale',
    itemLine: (n) => `Item #${n}`,
    revenueToday: 'Revenue today',
    cartTotal: 'Cart total',
    coreFeatures: 'Core features',
    features: [
      {
        title: 'Point of Sale',
        text: 'Check out faster, with zero friction.',
      },
      {
        title: 'Inventory',
        text: 'Know what you have and what to restock.',
      },
      {
        title: 'Customers',
        text: 'Understand habits to sell smarter.',
      },
      {
        title: 'Finance',
        text: 'See income and spend in seconds.',
      },
      {
        title: 'Pending sales',
        text: 'Orders and payments to close—always in sight.',
      },
      {
        title: 'Subscriptions',
        text: 'Run memberships without spreadsheets.',
      },
      {
        title: 'Subscription access',
        text: 'QR and checks tied to active subscriptions.',
      },
    ],
    qrModuleLabel: 'Subscription access',
    qrTitle: 'Active subscription. Access ready.',
    qrDesc:
      'Subscribers in good standing get a unique code. Validate entry, track attendance, and automate access.',
    qrScanning: 'Validating subscriber code…',
    qrValidated: 'Access validated',
    pricing: 'Pricing',
    pricingCurrency: 'All prices in Mexican Pesos (MXN).',
    pricingExcludesVat: 'Prices do not include VAT.',
    billingToggleMonthly: 'Monthly',
    billingToggleYearly: 'Yearly',
    billingToggleHint: 'Pro and Business: choose monthly or annual billing.',
    checkoutSubscribe: 'Subscribe',
    checkoutBuy: 'Buy now',
    checkoutLoading: 'Opening checkout…',
    checkoutErrorTitle: 'Could not open checkout',
    plans: [
      {
        tier: 'basic',
        name: 'BASIC',
        priceOneTime: '$1,500 MXN one-time',
        bullets: ['POS', 'Inventory', 'Customers', 'Single device'],
      },
      {
        tier: 'pro',
        name: 'PRO',
        priceMonthly: '$189 MXN/month',
        priceYearly: '$1,899 MXN/year',
        bullets: [
          'Everything in Basic',
          'Finance',
          'Pending sales',
          'Multi-device',
          'Cloud sync',
        ],
        featured: true,
      },
      {
        tier: 'business',
        name: 'BUSINESS',
        priceMonthly: '$299 MXN/month',
        priceYearly: '$2,999 MXN/year',
        bullets: [
          'Everything in Pro',
          'Subscriptions',
          'Subscription-based access',
          'Attendance tracking',
        ],
      },
    ],
    testimonials: [
      '"We replaced four tools with one. Daily ops are finally under control."',
      '"Onboarding got faster and billing mistakes disappeared."',
      '"Subscription-based access automation saved us hours every week."',
    ],
    finalCtaTitle: 'Stop guessing. Start controlling.',
    finalCtaButton: 'Start free',
    footer: 'MoneyMachine — Built for modern operators.',
  },
}

/**
 * Español por defecto; si en localStorage hay `en`, se usa inglés.
 */
export function useLocale() {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'es'
    return window.localStorage.getItem(LANG_STORAGE_KEY) === 'en' ? 'en' : 'es'
  })

  useEffect(() => {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'es' ? 'es' : 'en'
  }, [lang])

  return {
    lang,
    setLang,
    t: STRINGS[lang],
  }
}
