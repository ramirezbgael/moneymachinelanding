import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /** Menos ruido en la terminal de `npm run dev` (los [Debug] del navegador vienen del cliente HMR de Vite). */
  logLevel: 'warn',
})
