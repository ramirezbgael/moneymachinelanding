import { normalizeBusinessType } from './workspace'

/**
 * @typedef {{
 *   key: string,
 *   name: string,
 *   priceLabel: string,
 *   features: string[],
 *   comingSoon?: boolean,
 *   badge?: string,
 *   priceMonthlyLabel?: string,
 *   priceYearlyLabel?: string,
 *   priceMonthlyUsdLabel?: string,
 *   priceYearlyUsdLabel?: string,
 *   stripePriceIdMonthly: string,
 *   stripePriceIdYearly?: string,
 *   checkoutTier: 'pro' | 'business'
 * }} BusinessPlan
 */

function getEnvPriceIds(type, key) {
  const env = import.meta.env
  const map = {
    restaurant: {
      starter: {
        monthly: env.VITE_STRIPE_PRICE_RESTAURANT_STARTER_MONTHLY || 'price_1TRjigHsqoXrWYfSgekYg5s4',
        yearly: env.VITE_STRIPE_PRICE_RESTAURANT_STARTER_YEARLY || 'price_1TRjpSHsqoXrWYfS3cVI9fLZ',
      },
      pro: {
        monthly: env.VITE_STRIPE_PRICE_RESTAURANT_PRO_MONTHLY || env.VITE_STRIPE_PRICE_PRO_MONTHLY || '',
        yearly: env.VITE_STRIPE_PRICE_RESTAURANT_PRO_YEARLY || env.VITE_STRIPE_PRICE_PRO_YEARLY || '',
      },
      premium: {
        monthly: env.VITE_STRIPE_PRICE_RESTAURANT_PREMIUM_MONTHLY || 'price_1TRjjXHsqoXrWYfSWvYORZOH',
        yearly: env.VITE_STRIPE_PRICE_RESTAURANT_PREMIUM_YEARLY || 'price_1TRjtJHsqoXrWYfSjefg24Dn',
      },
    },
    retail: {
      basico: {
        monthly: env.VITE_STRIPE_PRICE_RETAIL_BASICO_MONTHLY || 'price_1TRk9THsqoXrWYfSdryiLGNF',
        yearly: env.VITE_STRIPE_PRICE_RETAIL_BASICO_YEARLY || 'price_1TRk9sHsqoXrWYfSP4xAp0uF',
      },
      pro: {
        monthly: env.VITE_STRIPE_PRICE_RETAIL_PRO_MONTHLY || env.VITE_STRIPE_PRICE_PRO_MONTHLY || '',
        yearly: env.VITE_STRIPE_PRICE_RETAIL_PRO_YEARLY || env.VITE_STRIPE_PRICE_PRO_YEARLY || '',
      },
    },
    gym: {
      gym: {
        monthly: env.VITE_STRIPE_PRICE_GYM_MONTHLY || 'price_1TRjwUHsqoXrWYfSxLSgZy1S',
        yearly: env.VITE_STRIPE_PRICE_GYM_YEARLY || 'price_1TRjx0HsqoXrWYfSsUygbmhS',
      },
    },
  }
  return map[type]?.[key] || { monthly: '', yearly: '' }
}

/** @param {string | null | undefined} type */
export function getPlansByBusinessType(type) {
  const normalized = normalizeBusinessType(type)
  /** @type {Record<string, BusinessPlan[]>} */
  const catalog = {
    restaurant: [
      {
        key: 'starter',
        name: 'Starter',
        priceLabel: '$590 MXN / month · $5490 MXN / year',
        priceMonthlyLabel: '$590 MXN / month',
        priceYearlyLabel: '$5490 MXN / year',
        priceMonthlyUsdLabel: '$34 USD / month',
        priceYearlyUsdLabel: '$299 USD / year',
        features: ['1 dispositivo', 'TPV basico'],
        stripePriceIdMonthly: getEnvPriceIds('restaurant', 'starter').monthly,
        stripePriceIdYearly: getEnvPriceIds('restaurant', 'starter').yearly,
        checkoutTier: 'pro',
      },
      {
        key: 'pro',
        name: 'Pro',
        priceLabel: '$1399 MXN / month · $13900 MXN / year',
        priceMonthlyLabel: '$1399 MXN / month',
        priceYearlyLabel: '$13900 MXN / year',
        priceMonthlyUsdLabel: '$79 USD / month',
        priceYearlyUsdLabel: '$799 USD / year',
        features: ['Comandas con meseros desde celular', 'Multi dispositivo', 'Control total de operaciones'],
        badge: 'Mas popular',
        stripePriceIdMonthly: getEnvPriceIds('restaurant', 'pro').monthly,
        stripePriceIdYearly: getEnvPriceIds('restaurant', 'pro').yearly,
        checkoutTier: 'pro',
      },
      {
        key: 'premium',
        name: 'Premium',
        priceLabel: '$2490 MXN / month · $23900 MXN / year',
        priceMonthlyLabel: '$2490 MXN / month',
        priceYearlyLabel: '$23900 MXN / year',
        features: ['Todo lo anterior', 'Autofacturacion por comensal (QR en mesa)', 'Menos carga operativa'],
        stripePriceIdMonthly: getEnvPriceIds('restaurant', 'premium').monthly,
        stripePriceIdYearly: getEnvPriceIds('restaurant', 'premium').yearly,
        checkoutTier: 'business',
      },
    ],
    retail: [
      {
        key: 'basico',
        name: 'Commerce Basico',
        priceLabel: '$149 MXN / month · $1399 MXN / year',
        priceMonthlyLabel: '$149 MXN / month',
        priceYearlyLabel: '$1399 MXN / year',
        features: ['TPV', 'Inventario', 'Clientes'],
        stripePriceIdMonthly: getEnvPriceIds('retail', 'basico').monthly,
        stripePriceIdYearly: getEnvPriceIds('retail', 'basico').yearly,
        checkoutTier: 'pro',
      },
      {
        key: 'pro',
        name: 'Commerce Pro',
        priceLabel: '$299 MXN / month',
        priceMonthlyLabel: '$299 MXN / month',
        priceYearlyLabel: undefined,
        features: ['Todo lo anterior', 'Facturacion electronica (proximamente)'],
        comingSoon: true,
        badge: 'Proximamente',
        stripePriceIdMonthly: getEnvPriceIds('retail', 'pro').monthly,
        stripePriceIdYearly: getEnvPriceIds('retail', 'pro').yearly,
        checkoutTier: 'pro',
      },
    ],
    gym: [
      {
        key: 'gym',
        name: 'Gym',
        priceLabel: '$549 MXN / mes · $4999 MXN / anual',
        priceMonthlyLabel: '$549 MXN / month',
        priceYearlyLabel: '$4999 MXN / year',
        features: ['Suscripciones', 'Acceso con QR', 'Control de asistencia'],
        stripePriceIdMonthly: getEnvPriceIds('gym', 'gym').monthly,
        stripePriceIdYearly: getEnvPriceIds('gym', 'gym').yearly,
        checkoutTier: 'pro',
      },
    ],
  }
  return catalog[normalized]
}

export function getPrimaryUpgradePlan(type) {
  const plans = getPlansByBusinessType(type)
  return plans.find((p) => p.key === 'pro') || plans[0]
}

export function resolveCurrentPlan(type, stripePriceId) {
  const plans = getPlansByBusinessType(type)
  const found = plans.find(
    (p) =>
      (p.stripePriceIdMonthly && p.stripePriceIdMonthly === stripePriceId) ||
      (p.stripePriceIdYearly && p.stripePriceIdYearly === stripePriceId),
  )
  return found || plans[0]
}

