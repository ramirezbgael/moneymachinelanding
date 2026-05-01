import { useEffect, useState } from 'react'

export const CURRENCY_STORAGE_KEY = 'mm-currency'
export const CURRENCY_CHANGE_EVENT = 'mm-currency-change'

function normalizeCurrency(value) {
  if (value === 'USD' || value === 'MXN') return value
  return null
}

export function detectCurrencyWithoutGeolocation() {
  if (typeof window === 'undefined') return 'MXN'

  const localeCandidates = [
    ...(window.navigator.languages ?? []),
    window.navigator.language,
    Intl.DateTimeFormat().resolvedOptions().locale,
  ]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase())

  const explicitMx = localeCandidates.some((locale) => locale.includes('-mx') || locale.endsWith('_mx'))
  if (explicitMx) return 'MXN'

  const explicitUs = localeCandidates.some((locale) => locale.includes('-us') || locale.endsWith('_us'))
  if (explicitUs) return 'USD'

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase() ?? ''
  if (timeZone.includes('mexico')) return 'MXN'

  const likelyUsd = /new_york|chicago|denver|los_angeles|phoenix|anchorage|honolulu/.test(timeZone)
  return likelyUsd ? 'USD' : 'MXN'
}

export function getPreferredCurrency() {
  if (typeof window === 'undefined') return 'MXN'
  const saved = normalizeCurrency(window.localStorage.getItem(CURRENCY_STORAGE_KEY))
  return saved ?? detectCurrencyWithoutGeolocation()
}

export function setPreferredCurrency(currency) {
  const normalized = normalizeCurrency(currency)
  if (!normalized || typeof window === 'undefined') return
  window.localStorage.setItem(CURRENCY_STORAGE_KEY, normalized)
  window.dispatchEvent(new CustomEvent(CURRENCY_CHANGE_EVENT, { detail: normalized }))
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState(() => getPreferredCurrency())

  const setCurrency = (nextCurrency) => {
    const normalized = normalizeCurrency(nextCurrency)
    if (!normalized) return
    setCurrencyState(normalized)
    setPreferredCurrency(normalized)
  }

  useEffect(() => {
    const syncFromStorage = () => setCurrencyState(getPreferredCurrency())
    const syncFromEvent = (event) => {
      const normalized = normalizeCurrency(event?.detail)
      if (normalized) setCurrencyState(normalized)
    }

    window.addEventListener('storage', syncFromStorage)
    window.addEventListener(CURRENCY_CHANGE_EVENT, syncFromEvent)
    return () => {
      window.removeEventListener('storage', syncFromStorage)
      window.removeEventListener(CURRENCY_CHANGE_EVENT, syncFromEvent)
    }
  }, [])

  return { currency, setCurrency }
}

export function toDisplayMoney(amountMxn, opts = {}) {
  const currency = normalizeCurrency(opts.currency) ?? 'MXN'
  const usdRate = Number(opts.usdRate) > 0 ? Number(opts.usdRate) : 17
  const locale = opts.locale ?? (currency === 'USD' ? 'en-US' : 'es-MX')

  const numeric = Number(amountMxn)
  const safeAmount = Number.isFinite(numeric) ? numeric : 0
  const raw = currency === 'USD' ? safeAmount / usdRate : safeAmount
  const rounded = currency === 'USD' ? Math.round(raw) : Math.round(raw)

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(rounded)
}

export function convertPriceLabelFromMxn(label, opts = {}) {
  const currency = normalizeCurrency(opts.currency) ?? 'MXN'
  const usdRate = Number(opts.usdRate) > 0 ? Number(opts.usdRate) : 17
  const locale = opts.locale ?? (currency === 'USD' ? 'en-US' : 'es-MX')
  if (currency === 'MXN') {
    return String(label).replace(/\$([\d,]+(?:\.\d+)?)/g, (_, amount) => {
      const normalized = Number(String(amount).replaceAll(',', ''))
      const formatted = Number.isFinite(normalized) ? Math.round(normalized) : 0
      return `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(formatted)}`
    })
  }
  if (/\bUSD\b/i.test(String(label))) return label

  const convertedAmounts = String(label).replace(/\$([\d,]+(?:\.\d+)?)/g, (_, amount) => {
    const normalized = Number(String(amount).replaceAll(',', ''))
    const converted = Number.isFinite(normalized) ? Math.round(normalized / usdRate) : 0
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(converted)
  })

  return convertedAmounts
    .replaceAll('MXN', 'USD')
    .replaceAll('mxn', 'usd')
    .replaceAll('pesos mexicanos', 'US dollars')
}
