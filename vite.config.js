import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './frontend',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './frontend/src')
    }
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    include: ['ethers']
  }
})