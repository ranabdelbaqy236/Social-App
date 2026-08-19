import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Assign15/',
  plugins: [react()],
  server: {
    port: 5173,
  },
})