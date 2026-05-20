#!/usr/bin/env node
/**
 * Genera public/sitemap.xml y public/robots.txt desde src/lib/sitemapUrls.js
 * Uso: npm run generate:sitemap
 *      SITE_URL=https://tu-dominio.com npm run generate:sitemap
 */
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SITE_ORIGIN,
  buildRobotsTxt,
  buildSitemapXml,
  getSitemapEntries,
} from '../src/lib/sitemapUrls.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')
const origin = (process.env.SITE_URL || SITE_ORIGIN).replace(/\/$/, '')

const entries = getSitemapEntries()
const sitemapXml = buildSitemapXml(entries, origin)
const robotsTxt = buildRobotsTxt(origin)

writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemapXml, 'utf8')
writeFileSync(resolve(publicDir, 'robots.txt'), robotsTxt, 'utf8')

console.log(`Sitemap: ${entries.length} URLs → public/sitemap.xml`)
console.log(`Origin: ${origin}`)
console.log('Robots: public/robots.txt')
