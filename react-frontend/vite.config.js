import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Force single React copy and optimize deps to avoid prebundling duplicates
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  // Development proxy: forward /api requests to the Quarkus backend on 8081
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
