import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8080", // Puerto de Quarkus
        changeOrigin: true,
        secure: false,
      },
    },
  },
});