import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'static',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',
      output: {
        entryFileNames: 'js/index.js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/index.css'
          }
          return 'assets/[name]-[hash].[ext]'
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': 'https://voice-bot-backend-fmgfctdkaac7hads.eastus2-01.azurewebsites.net',
      '/ws': {
        target: 'ws://voice-bot-backend-fmgfctdkaac7hads.eastus2-01.azurewebsites.net/',
        ws: true
      }
    }
  }
})
