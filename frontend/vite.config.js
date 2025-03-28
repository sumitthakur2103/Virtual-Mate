import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Ensure the base property is correctly set for deployment
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    outDir: 'dist', // Ensure this is set to 'dist'
  },
  server: {
    historyApiFallback: true, // Ensure fallback for SPA routing in dev mode
  }
})
