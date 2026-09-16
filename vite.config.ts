import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

function prepareCadRuntimeAssets() {
  const assetDir = resolve(rootDir, 'public/assets')
  mkdirSync(assetDir, { recursive: true })

  const assets = [
    {
      source: resolve(rootDir, 'node_modules/@mlightcad/cad-simple-viewer/dist/mtext-renderer-worker.js'),
      target: resolve(assetDir, 'mtext-renderer-worker.js'),
    },
    {
      source: resolve(rootDir, 'node_modules/@mlightcad/libredwg-converter/dist/libredwg-parser-worker.js'),
      target: resolve(assetDir, 'libredwg-parser-worker.js'),
    },
    {
      source: resolve(rootDir, 'node_modules/@mlightcad/libredwg-converter/dist/libredwg-web.wasm'),
      target: resolve(assetDir, 'libredwg-web.wasm'),
    },
    {
      source: resolve(rootDir, 'node_modules/@mlightcad/cad-html-plugin/dist/viewer-runtime.iife.js'),
      target: resolve(assetDir, 'viewer-runtime.iife.js'),
    },
  ]

  for (const asset of assets) {
    if (existsSync(asset.source)) copyFileSync(asset.source, asset.target)
  }
}

prepareCadRuntimeAssets()

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '__vite-optional-peer-dep:@mlightcad/cad-agent-plugin/style.css:@mlightcad/cad-viewer:false': resolve(rootDir, 'src/vendor/cad-agent-placeholder.css'),
    },
  },
  plugins: [vue()],
  build: {
    outDir: 'dist',
    modulePreload: false,
    rollupOptions: {
      input: 'index.html',
    },
  },
})
