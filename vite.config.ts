import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: './node_modules/@mlightcad/cad-simple-viewer/dist/mtext-renderer-worker.js',
          dest: 'assets',
        },
        {
          src: './node_modules/@mlightcad/libredwg-converter/dist/libredwg-parser-worker.js',
          dest: 'assets',
        },
        {
          src: './node_modules/@mlightcad/libredwg-converter/dist/libredwg-web.wasm',
          dest: 'assets',
        },
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    modulePreload: false,
    rollupOptions: {
      input: 'index.html',
    },
  },
})
