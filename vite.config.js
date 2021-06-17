import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  build: {
      rollupOptions: {
        external: [ 'eFlag.svg' ]
      },
  },
  plugins: [vue()]
})
