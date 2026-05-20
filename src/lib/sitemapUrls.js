import { SEO_LANDING_DATA } from './seoLandingData.js'
import { SOLUTION_LANDING_DATA } from './solutionLandingData.js'

/** URL canónica del sitio marketing (sin barra final). */
export const SITE_ORIGIN = 'https://moneymachine.com.mx'

/**
 * Rutas estáticas indexables. `priority` y `changefreq` orientados a SEO comercial.
 * @type {Array<{ path: string, changefreq: string, priority: string }>}
 */
export const SITEMAP_STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/pricing', changefreq: 'weekly', priority: '0.85' },
  { path: '/register', changefreq: 'monthly', priority: '0.8' },
  { path: '/soluciones', changefreq: 'weekly', priority: '0.9' },
  { path: '/guias', changefreq: 'weekly', priority: '0.9' },
  // Pilares y BOFU
  { path: '/soluciones/plataforma-todo-en-uno-negocio', changefreq: 'weekly', priority: '0.9' },
  { path: '/soluciones/mejor-pos-mexico-2026', changefreq: 'weekly', priority: '0.9' },
  { path: '/soluciones/alternativas-square-mexico', changefreq: 'weekly', priority: '0.85' },
  { path: '/soluciones/dashboard-ventas-movil-mexico', changefreq: 'weekly', priority: '0.85' },
  { path: '/soluciones/comercios', changefreq: 'weekly', priority: '0.85' },
  { path: '/soluciones/restaurantes', changefreq: 'weekly', priority: '0.85' },
  { path: '/soluciones/sistema-membresias-gym-mexico', changefreq: 'weekly', priority: '0.85' },
  { path: '/soluciones/app-pedidos-meseros', changefreq: 'weekly', priority: '0.85' },
  { path: '/soluciones/sistema-pos-para-restaurantes', changefreq: 'monthly', priority: '0.8' },
  { path: '/soluciones/software-para-restaurantes-en-mexico', changefreq: 'monthly', priority: '0.8' },
  // Guías AEO
  { path: '/guias/ver-ventas-negocio-celular-tiempo-real', changefreq: 'monthly', priority: '0.8' },
  { path: '/guias/monitorear-caja-tiempo-real', changefreq: 'monthly', priority: '0.8' },
  { path: '/guias/automatizar-cobro-mensualidades-gimnasio', changefreq: 'monthly', priority: '0.8' },
  { path: '/guias/sistema-pedidos-restaurante-celular', changefreq: 'monthly', priority: '0.8' },
  { path: '/guias/mejor-app-inventario-tienda-pequena-mexico', changefreq: 'monthly', priority: '0.8' },
  { path: '/guias/como-aumentar-ventas-restaurante', changefreq: 'monthly', priority: '0.75' },
  { path: '/guias/como-controlar-inventario-negocio', changefreq: 'monthly', priority: '0.75' },
  { path: '/guias/pos-para-restaurantes-pequenos', changefreq: 'monthly', priority: '0.75' },
  { path: '/guias/como-llevar-control-de-caja-en-restaurante', changefreq: 'monthly', priority: '0.75' },
  { path: '/guias/como-reducir-mermas-en-restaurante', changefreq: 'monthly', priority: '0.75' },
  { path: '/guias/como-mejorar-tiempos-de-cobro-restaurante', changefreq: 'monthly', priority: '0.75' },
  // Legal
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
]

/** Verticales dinámicas: /soluciones/:slug */
export const SITEMAP_SOLUTION_SLUGS = Object.keys(SOLUTION_LANDING_DATA).map((slug) => ({
  path: `/soluciones/${slug}`,
  changefreq: 'monthly',
  priority: '0.7',
}))

/** Landings SEO: /soluciones/landing/:slug */
export const SITEMAP_SEO_LANDING_SLUGS = Object.keys(SEO_LANDING_DATA).map((slug) => ({
  path: `/soluciones/landing/${slug}`,
  changefreq: 'monthly',
  priority: '0.75',
}))

/**
 * Lista deduplicada de entradas para sitemap.xml
 * @param {string} [lastmod] ISO date YYYY-MM-DD
 */
export function getSitemapEntries(lastmod = new Date().toISOString().slice(0, 10)) {
  const merged = [...SITEMAP_STATIC_ROUTES, ...SITEMAP_SOLUTION_SLUGS, ...SITEMAP_SEO_LANDING_SLUGS]
  const byPath = new Map()

  for (const entry of merged) {
    if (!byPath.has(entry.path)) {
      byPath.set(entry.path, { ...entry, lastmod })
    }
  }

  return [...byPath.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, entry]) => entry)
}

export function buildSitemapXml(entries, origin = SITE_ORIGIN) {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${origin}${e.path}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

export function buildRobotsTxt(origin = SITE_ORIGIN) {
  return `# MoneyMachine — robots.txt
User-agent: *
Allow: /

# No indexar área de producto autenticada
Disallow: /dashboard
Disallow: /stores
Disallow: /users
Disallow: /modules
Disallow: /subscription
Disallow: /settings
Disallow: /onboarding
Disallow: /auth/

Sitemap: ${origin}/sitemap.xml
`
}
