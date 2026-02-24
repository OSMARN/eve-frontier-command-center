import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@evefrontier/dapp-kit',
      '@mysten/dapp-kit-react',
      '@tanstack/react-query',
      '@radix-ui/themes'
    ],
    force: true
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})
