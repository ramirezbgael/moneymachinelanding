/**
 * Lógica pura para mostrar estado de suscripción / trial en UI (sin React).
 * @module subscriptionDisplay
 */

const DEFAULT_TRIAL_DAYS = 7

/**
 * Días completos restantes hasta `trialEndsAt` (redondeo hacia arriba).
 * @param {string | Date | null | undefined} trialEndsAt
 * @param {Date} [now]
 * @returns {number | null} null si no hay fecha válida
 */
export function getTrialDaysRemaining(trialEndsAt, now = new Date()) {
  if (!trialEndsAt) return null
  const end = trialEndsAt instanceof Date ? trialEndsAt : new Date(trialEndsAt)
  if (Number.isNaN(end.getTime())) return null
  const ms = end.getTime() - now.getTime()
  if (ms <= 0) return 0
  return Math.ceil(ms / 86400000)
}

/**
 * Información de trial para barra de progreso y textos.
 * Asume ventana de prueba de `trialLengthDays` terminando en `trialEndsAt`.
 *
 * @param {string | Date | null | undefined} trialEndsAt
 * @param {{ trialLengthDays?: number, now?: Date }} [opts]
 * @returns {{
 *   daysRemaining: number | null,
 *   isExpired: boolean,
 *   endDate: Date | null,
 *   percentElapsed: number,
 *   trialLengthDays: number
 * }}
 */
export function getTrialProgressInfo(trialEndsAt, opts = {}) {
  const trialLengthDays = opts.trialLengthDays ?? DEFAULT_TRIAL_DAYS
  const now = opts.now ?? new Date()

  if (!trialEndsAt) {
    return {
      daysRemaining: null,
      isExpired: true,
      endDate: null,
      percentElapsed: 100,
      trialLengthDays,
    }
  }

  const end = trialEndsAt instanceof Date ? new Date(trialEndsAt.getTime()) : new Date(trialEndsAt)
  if (Number.isNaN(end.getTime())) {
    return {
      daysRemaining: null,
      isExpired: true,
      endDate: null,
      percentElapsed: 100,
      trialLengthDays,
    }
  }

  const msLeft = end.getTime() - now.getTime()
  const isExpired = msLeft <= 0
  const daysRemaining = isExpired ? 0 : Math.max(0, Math.ceil(msLeft / 86400000))

  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - trialLengthDays)
  const totalMs = end.getTime() - start.getTime()
  let percentElapsed = 100
  if (totalMs > 0) {
    const elapsed = now.getTime() - start.getTime()
    percentElapsed = Math.min(100, Math.max(0, (elapsed / totalMs) * 100))
  }

  return {
    daysRemaining,
    isExpired,
    endDate: end,
    percentElapsed,
    trialLengthDays,
  }
}

/**
 * @param {Date | null} date
 * @param {string} [locale]
 */
export function formatSubscriptionDate(date, locale = 'es-MX') {
  if (!date || Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Nombre comercial del plan según perfil (sin depender solo de plan column).
 * @param {object | null | undefined} profile
 */
export function displayPlanName(profile) {
  if (!profile) return '—'
  const plan = String(profile.plan ?? 'free').toLowerCase()
  const billing = String(profile.billing_status ?? '').toLowerCase()
  if (plan === 'business') return 'Business'
  if (plan === 'pro') return 'Pro'
  if (billing === 'trial' || plan === 'trial') return 'Prueba'
  return 'Gratis'
}

/**
 * @typedef {'marketing_trial' | 'stripe_trial' | 'active' | 'canceled' | 'payment_issue' | 'trial_ended' | 'none'} SubscriptionUiKind
 */

/**
 * Snapshot para el card "Plan actual".
 *
 * @param {{
 *   profile: object | null,
 *   activeSubscription: object | null,
 *   latestSubscription: object | null,
 *   now?: Date
 * }} p
 */
export function deriveSubscriptionSnapshot(p) {
  const { profile, activeSubscription, latestSubscription } = p
  const now = p.now ?? new Date()

  const billingStatus = String(profile?.billing_status ?? '').toLowerCase()
  const latestStatus = String(latestSubscription?.status ?? '').toLowerCase()

  /** @type {SubscriptionUiKind} */
  let kind = 'none'
  let badgeLabel = 'Sin suscripción'
  let badgeTone = 'muted'
  let planName = displayPlanName(profile)
  let statusLine = 'Sin plan de pago activo'
  let expiryDate = /** @type {Date | null} */ (null)
  let trialProgressFrom = /** @type {string | null} */ (null)
  let showTrialProgress = false
  let emoji = '📋'
  let primaryCta = /** @type {'upgrade' | 'manage' | null} */ ('upgrade')

  const periodEnd = activeSubscription?.current_period_end
    ? new Date(activeSubscription.current_period_end)
    : null
  const latestPeriodEnd = latestSubscription?.current_period_end
    ? new Date(latestSubscription.current_period_end)
    : null

  if (activeSubscription) {
    const st = String(activeSubscription.status ?? '').toLowerCase()
    planName = displayPlanName(profile)
    if (st === 'trialing') {
      kind = 'stripe_trial'
      badgeLabel = 'Trial activo'
      badgeTone = 'trial'
      statusLine = 'Periodo de prueba con Stripe'
      expiryDate = periodEnd && !Number.isNaN(periodEnd.getTime()) ? periodEnd : null
      // No barra fija de N días: el largo del trial lo define Stripe.
      trialProgressFrom = null
      showTrialProgress = false
      emoji = '🧪'
      primaryCta = 'manage'
    } else {
      kind = 'active'
      badgeLabel = 'Activo'
      badgeTone = 'active'
      statusLine = 'Suscripción al día'
      expiryDate = periodEnd && !Number.isNaN(periodEnd.getTime()) ? periodEnd : null
      emoji = '🚀'
      primaryCta = 'manage'
    }
    return {
      kind,
      badgeLabel,
      badgeTone,
      planName,
      statusLine,
      expiryDate,
      trialProgressFrom,
      showTrialProgress,
      emoji,
      primaryCta,
      stripeStatus: st,
    }
  }

  if (latestSubscription && ['past_due', 'unpaid'].includes(latestStatus)) {
    kind = 'payment_issue'
    badgeLabel = 'Pago pendiente'
    badgeTone = 'warning'
    planName = displayPlanName(profile)
    statusLine = 'Actualiza tu método de pago en Stripe'
    expiryDate = latestPeriodEnd && !Number.isNaN(latestPeriodEnd.getTime()) ? latestPeriodEnd : null
    emoji = '⚠️'
    primaryCta = 'manage'
    return {
      kind,
      badgeLabel,
      badgeTone,
      planName,
      statusLine,
      expiryDate,
      trialProgressFrom: null,
      showTrialProgress: false,
      emoji,
      primaryCta,
      stripeStatus: latestStatus,
    }
  }

  const canceledByProfile = ['canceled', 'unpaid', 'incomplete_expired'].includes(billingStatus)
  const canceledByStripe = latestStatus === 'canceled'

  if (canceledByProfile || canceledByStripe) {
    kind = 'canceled'
    badgeLabel = 'Cancelado'
    badgeTone = 'canceled'
    planName = displayPlanName(profile)
    statusLine = 'Tu suscripción ya no está activa'
    expiryDate = latestPeriodEnd && !Number.isNaN(latestPeriodEnd.getTime()) ? latestPeriodEnd : null
    emoji = '⏸️'
    primaryCta = 'upgrade'
    return {
      kind,
      badgeLabel,
      badgeTone,
      planName,
      statusLine,
      expiryDate,
      trialProgressFrom: null,
      showTrialProgress: false,
      emoji,
      primaryCta,
      stripeStatus: latestStatus || billingStatus,
    }
  }

  const trialEndRaw = profile?.trial_ends_at
  const trialEnd = trialEndRaw ? new Date(trialEndRaw) : null
  const trialValid = trialEnd && !Number.isNaN(trialEnd.getTime())
  const marketingTrial =
    billingStatus === 'trial' && trialValid && trialEnd.getTime() > now.getTime()

  const trialEndedOnProfile = billingStatus === 'trial' && trialValid && trialEnd.getTime() <= now.getTime()

  if (trialEndedOnProfile && !activeSubscription) {
    kind = 'trial_ended'
    badgeLabel = 'Trial finalizado'
    badgeTone = 'canceled'
    planName = 'Prueba'
    statusLine = 'Tu prueba gratuita terminó — elige un plan para continuar'
    expiryDate = trialEnd
    emoji = '⏱️'
    primaryCta = 'upgrade'
    return {
      kind,
      badgeLabel,
      badgeTone,
      planName,
      statusLine,
      expiryDate,
      trialProgressFrom: null,
      showTrialProgress: false,
      emoji,
      primaryCta,
      stripeStatus: 'trial_ended',
    }
  }

  if (marketingTrial) {
    kind = 'marketing_trial'
    badgeLabel = 'Trial activo'
    badgeTone = 'trial'
    planName = 'Prueba'
    statusLine = 'Estás en el periodo de prueba gratuito'
    expiryDate = trialEnd
    trialProgressFrom = trialEndRaw
    showTrialProgress = true
    emoji = '🧪'
    primaryCta = 'upgrade'
    return {
      kind,
      badgeLabel,
      badgeTone,
      planName,
      statusLine,
      expiryDate,
      trialProgressFrom,
      showTrialProgress,
      emoji,
      primaryCta,
      stripeStatus: 'trial',
    }
  }

  kind = 'none'
  badgeLabel = 'Sin suscripción'
  badgeTone = 'muted'
  planName = displayPlanName(profile)
  statusLine = 'Elige un plan cuando quieras desbloquear todo'
  primaryCta = 'upgrade'
  emoji = '✨'

  return {
    kind,
    badgeLabel,
    badgeTone,
    planName,
    statusLine,
    expiryDate: null,
    trialProgressFrom: null,
    showTrialProgress: false,
    emoji,
    primaryCta,
    stripeStatus: billingStatus || 'none',
  }
}

/**
 * Props de ejemplo para pruebas / Storybook del `CurrentPlanCard`.
 * @example
 * ```jsx
 * <CurrentPlanCard
 *   profile={MOCK_CURRENT_PLAN_CARD_PROPS.trialProfile}
 *   activeSubscription={null}
 *   latestSubscription={null}
 *   onUpgrade={() => {}}
 *   onManageSubscription={async () => {}}
 * />
 * ```
 */
export const MOCK_CURRENT_PLAN_CARD_PROPS = {
  trialProfile: {
    plan: 'free',
    billing_status: 'trial',
    trial_ends_at: new Date(Date.now() + 3 * 86400000).toISOString(),
  },
  activeProfile: {
    plan: 'pro',
    billing_status: 'active',
    trial_ends_at: null,
  },
  activeSubscription: {
    status: 'active',
    current_period_end: new Date(Date.now() + 28 * 86400000).toISOString(),
  },
  canceledLatest: {
    status: 'canceled',
    current_period_end: new Date(Date.now() - 86400000).toISOString(),
  },
}
