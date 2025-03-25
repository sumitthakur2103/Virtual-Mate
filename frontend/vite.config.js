import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    outDir: 'dist', // Ensure this is set to 'dist'
  },
  base: '/', // Ensure the base path is set correctly
  server: {
    historyApiFallback: true // Ensure fallback to index.html for SPA
  }
})
