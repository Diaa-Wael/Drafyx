import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'
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
      '@mlightcad/cad-agent-plugin/register': resolve(rootDir, 'src/vendor/optional-plugin-stub.ts'),
      '@mlightcad/cad-agent-plugin/style.css': resolve(rootDir, 'src/vendor/optional-plugin-placeholder.css'),
      '@mlightcad/cad-html-plugin/register': resolve(rootDir, 'src/vendor/optional-plugin-stub.ts'),
      '@mlightcad/cad-html-plugin/style.css': resolve(rootDir, 'src/vendor/optional-plugin-placeholder.css'),
      '@mlightcad/cad-pdf-plugin/register': resolve(rootDir, 'src/vendor/optional-plugin-stub.ts'),
      '@mlightcad/cad-pdf-plugin/style.css': resolve(rootDir, 'src/vendor/optional-plugin-placeholder.css'),
      '__vite-optional-peer-dep:@mlightcad/cad-agent-plugin/style.css:@mlightcad/cad-viewer:false': resolve(rootDir, 'src/vendor/optional-plugin-placeholder.css'),
      '__vite-optional-peer-dep:@mlightcad/cad-html-plugin/style.css:@mlightcad/cad-viewer:false': resolve(rootDir, 'src/vendor/optional-plugin-placeholder.css'),
      '__vite-optional-peer-dep:@mlightcad/cad-pdf-plugin/style.css:@mlightcad/cad-viewer:false': resolve(rootDir, 'src/vendor/optional-plugin-placeholder.css'),
    },
  },
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: './node_modules/@mlightcad/cad-simple-viewer/dist/mtext-renderer-worker.js',
          dest: 'assets',
          rename: { stripBase: true },
        },
        {
          src: './node_modules/@mlightcad/libredwg-converter/dist/libredwg-parser-worker.js',
          dest: 'assets',
          rename: { stripBase: true },
        },
        {
          src: './node_modules/@mlightcad/libredwg-converter/dist/libredwg-web.wasm',
          dest: 'assets',
          rename: { stripBase: true },
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
