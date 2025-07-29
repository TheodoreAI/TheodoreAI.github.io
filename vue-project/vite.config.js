import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'three/addons/': 'three/examples/jsm/'
    }
  },
  optimizeDeps: {
    include: ['three']
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  }
}) 