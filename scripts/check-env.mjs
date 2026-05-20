#!/usr/bin/env node
/**
 * Falla el build si faltan variables que Vite embebe en el JS de producción.
 * Local: requiere .env. Netlify: define las VITE_* en Site configuration → Environment variables.
 */
import { loadEnv } from 'vite'

const env = loadEnv('production', process.cwd(), '')
const url = (env.VITE_SUPABASE_URL ?? '').trim()
const anon = (env.VITE_SUPABASE_ANON_KEY ?? '').trim()

const errors = []

if (!url) errors.push('VITE_SUPABASE_URL está vacía')
else if (!/^https?:\/\/.+/i.test(url)) errors.push('VITE_SUPABASE_URL debe ser http(s)://…')

if (!anon) errors.push('VITE_SUPABASE_ANON_KEY está vacía')

if (errors.length) {
  console.error('\n[build] Faltan variables de entorno requeridas:\n')
  for (const e of errors) console.error(`  • ${e}`)
  console.error(
    '\nLocal: agrega los valores en .env (ver .env.example).\n' +
      'Netlify: Site configuration → Environment variables → añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.\n',
  )
  process.exit(1)
}

console.log('[build] VITE_SUPABASE_URL OK')
