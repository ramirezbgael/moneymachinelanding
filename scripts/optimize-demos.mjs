#!/usr/bin/env node
/**
 * Convierte GIFs pesados en MP4 optimizados para la landing.
 * Requiere ffmpeg. Fuentes: public/assets/gif/gif{1,2,3}.gif
 * Salida: public/assets/video/gif{1,2,3}.mp4 + posters JPG
 */
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const gifDir = join(root, 'public/assets/gif')
const outDir = join(root, 'public/assets/video')
const ids = ['gif1', 'gif2', 'gif3']

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' })
}

try {
  execSync('ffmpeg -version', { stdio: 'ignore' })
} catch {
  console.error('Instala ffmpeg: brew install ffmpeg')
  process.exit(1)
}

for (const id of ids) {
  const input = join(gifDir, `${id}.gif`)
  const mp4 = join(outDir, `${id}.mp4`)
  const poster = join(outDir, `${id}-poster.jpg`)

  if (!existsSync(input)) {
    console.warn(`Omitido (no existe): ${input}`)
    continue
  }

  console.log(`\n→ ${id}.gif → ${id}.mp4`)
  run(
    `ffmpeg -y -i "${input}" -movflags +faststart -pix_fmt yuv420p -vf "scale='min(960,iw)':-2" -an -c:v libx264 -crf 28 -preset medium "${mp4}"`,
  )

  console.log(`→ poster ${id}-poster.jpg`)
  run(`ffmpeg -y -i "${mp4}" -vframes 1 -q:v 6 "${poster}"`)
}

console.log('\nListo. Usa /assets/video/*.mp4 en la landing (no subas los .gif a producción).')
