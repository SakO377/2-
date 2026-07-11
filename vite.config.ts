import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// On production build (GitHub Pages) assets are served from /2-/;
// during local dev they stay at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/2-/' : '/',
  plugins: [react(), tailwindcss()],
}))
