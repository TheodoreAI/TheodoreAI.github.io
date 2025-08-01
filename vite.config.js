import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/TheodoreAI.github.io/',
  resolve: {
    alias: {
      'three/addons/': 'three/examples/jsm/'
    }
  },
  optimizeDeps: {
    include: ['three']
  },
  build: {
    // Ensure all dependencies are bundled for static hosting
    rollupOptions: {
      // No external or manualChunks for app build
    }
  }
}) 