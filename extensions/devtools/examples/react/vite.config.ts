import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      '@tevm/devtools': path.resolve(__dirname, '../../src/index.ts'),
      '@tevm/devtools/react': path.resolve(__dirname, '../../src/react/index.ts'),
    },
  },
})


