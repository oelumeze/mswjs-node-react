import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-mock-devtools': path.resolve(__dirname, 'packages/devtools/src/index.ts'),
    },
  },
})
