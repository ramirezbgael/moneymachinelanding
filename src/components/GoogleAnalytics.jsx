import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = 'G-CFMK76VZVD'

/**
 * Envía page_view en cada cambio de ruta (SPA).
 * La etiqueta base va en index.html; esto complementa la navegación client-side.
 */
export function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window.gtag !== 'function') return
    const pagePath = location.pathname + location.search + location.hash
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: pagePath })
  }, [location])

  return null
}
