<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { MlCadViewer } from '@mlightcad/cad-viewer'
import { AcApSettingManager } from '@mlightcad/cad-simple-viewer'
import { registerLibreDwg } from './registerLibreDwg'

registerLibreDwg()

AcApSettingManager.instance.isShowToolbar = true
AcApSettingManager.instance.isShowCommandLine = false
AcApSettingManager.instance.isShowCoordinate = true
AcApSettingManager.instance.isShowEntityInfo = true
AcApSettingManager.instance.isShowStats = false

const input = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | undefined>()
const isViewerOpen = ref(false)
const isDragging = ref(false)
const errorMessage = ref('')
const recentFiles = ref<Array<{ name: string; size: number; type: string }>>([])

const accept = '.dwg,.dxf'

const formattedSize = computed(() => {
  if (!selectedFile.value) return ''
  return formatBytes(selectedFile.value.size)
})

function formatBytes(value: number): string {
  if (value < 1024) return `${value} B`
  const units = ['KB', 'MB', 'GB']
  let size = value / 1024
  let unit = units[0]
  for (let i = 1; i < units.length && size >= 1024; i += 1) {
    size /= 1024
    unit = units[i]
  }
  return `${size.toFixed(size >= 10 ? 1 : 2)} ${unit}`
}

function isCadFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return /\.(dwg|dxf)$/.test(name)
}

async function openFile(file?: File): Promise<void> {
  errorMessage.value = ''
  if (!file) return

  if (!isCadFile(file)) {
    errorMessage.value = 'Drafyx supports AutoCAD drawing formats such as DWG and DXF.'
    return
  }

  try {
    registerLibreDwg()
    selectedFile.value = file
    rememberFile(file)
    isViewerOpen.value = true
    await nextTick()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Could not open this CAD file.'
  }
}

function rememberFile(file: File): void {
  recentFiles.value = [
    { name: file.name, size: file.size, type: file.type || getExtension(file.name) },
    ...recentFiles.value.filter((item) => item.name !== file.name),
  ].slice(0, 5)
}

function getExtension(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? `.${parts.at(-1)!.toLowerCase()}` : ''
}

function chooseFile(): void {
  input.value?.click()
}

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  void openFile(target.files?.[0])
  target.value = ''
}

function onDrop(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = false
  void openFile(event.dataTransfer?.files?.[0])
}

function newDrawing(): void {
  errorMessage.value = ''
  const dxf = createSampleDxf()
  void openFile(new File([dxf], 'drafyx-sample.dxf', { type: 'application/dxf' }))
}

function closeViewer(): void {
  isViewerOpen.value = false
  selectedFile.value = undefined
  errorMessage.value = ''
}

function createSampleDxf(): string {
  const line = (x1: number, y1: number, x2: number, y2: number) => [
    '0', 'LINE', '8', '0', '10', String(x1), '20', String(y1), '11', String(x2), '21', String(y2),
  ].join('\n')

  const circle = (x: number, y: number, r: number) => [
    '0', 'CIRCLE', '8', '0', '10', String(x), '20', String(y), '40', String(r),
  ].join('\n')

  const polyline = [
    '0', 'LWPOLYLINE', '8', '0', '90', '4', '70', '1',
    '10', '20', '20', '10',
    '10', '180', '20', '10',
    '10', '180', '20', '90',
    '10', '20', '20', '90',
  ].join('\n')

  return [
    '0', 'SECTION', '2', 'HEADER', '0', 'ENDSEC',
    '0', 'SECTION', '2', 'TABLES', '0', 'ENDSEC',
    '0', 'SECTION', '2', 'ENTITIES',
    line(0, 0, 200, 0),
    line(200, 0, 200, 100),
    line(200, 100, 0, 100),
    line(0, 100, 0, 0),
    polyline,
    circle(100, 50, 22),
    line(100, 50, 155, 50),
    line(100, 50, 100, 85),
    '0', 'ENDSEC', '0', 'EOF',
  ].join('\n')
}
</script>

<template>
  <div class="app-shell">
    <header class="topbar" data-drafyx-shell-header>
      <div class="brand" aria-label="Drafyx">
        <div class="brand-mark">D</div>
        <div>
          <div class="brand-name">Drafyx</div>
          <div class="brand-subtitle">Browser CAD viewer</div>
        </div>
      </div>

      <div class="topbar-actions">
        <button class="ghost-button" type="button" @click="newDrawing">New sample</button>
        <button class="primary-button compact open-cad-top" type="button" @click="chooseFile"><span class="open-cad-label">Open CAD</span><span class="open-cad-icon">↥</span></button>
      </div>
    </header>

    <main
      class="page"
      :class="{ 'viewer-mode': isViewerOpen }"
      @dragenter.prevent="isDragging = true"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop="onDrop"
    >
      <section v-if="!isViewerOpen" class="landing">
        <div class="hero-copy">
          <div class="eyebrow">DWG · DXF · MOBILE READY</div>
          <h1>Inspect CAD drawings<br /><span>without desktop CAD.</span></h1>
          <p>
            Open AutoCAD 2D files directly in your browser. Pan, zoom, inspect layers and entities,
            and review drawings on phones, tablets, or desktop browsers.
          </p>

          <div class="hero-actions">
            <button class="primary-button hero-button" type="button" @click="chooseFile">
              <span class="button-icon">↥</span>
              Open a drawing
            </button>
            <button class="secondary-button hero-button" type="button" @click="newDrawing">
              Try the sample
            </button>
          </div>

          <p v-if="errorMessage" class="error-text" role="alert">{{ errorMessage }}</p>

          <div class="trust-row">
            <span>●</span> Local browser processing
            <span>●</span> No CAD desktop app required
          </div>
        </div>

        <div class="upload-card" :class="{ dragging: isDragging }">
          <div class="upload-grid"></div>
          <div class="upload-content">
            <div class="drop-icon">⌁</div>
            <h2>{{ isDragging ? 'Drop your drawing' : 'Drop a CAD file here' }}</h2>
            <p>Or use the file picker. Drafyx is built around DWG and DXF browser review.</p>
            <button class="secondary-button" type="button" @click="chooseFile">Choose file</button>
            <div class="format-row">
              <span>DWG</span>
              <span>DXF</span>
              
            </div>
          </div>
        </div>
      </section>

      <section v-else class="workspace">
        <div class="workspace-toolbar">
          <div class="file-pill">
            <div class="file-symbol">CAD</div>
            <div class="file-meta">
              <strong>{{ selectedFile?.name }}</strong>
              <span>{{ formattedSize }} · processed locally</span>
            </div>
          </div>
          <div class="workspace-actions">
            <button class="ghost-button" type="button" @click="chooseFile">Open another</button>
            <button class="ghost-button close" type="button" @click="closeViewer">Close</button>
          </div>
        </div>

        <div class="viewer-card">
          <MlCadViewer
            :key="selectedFile?.name + selectedFile?.lastModified"
            locale="en"
            :local-file="selectedFile"
            :background="0x0b0d10"
            :mode="'AcEdOpenMode.Review'"
            :is-show-command-line="false"
            :is-show-main-menu="false"
            :is-show-toolbar="true"
            :is-show-coordinate="true"
            :is-show-entity-info="true"
            :is-show-language-selector="false"
            :is-show-stats="false"
          />
        </div>
      </section>

      <input
        ref="input"
        class="hidden-file-input"
        type="file"
        :accept="accept"
        @change="onInput"
      />

      <div v-if="isDragging && !isViewerOpen" class="drop-overlay">
        <div class="drop-overlay-inner">
          <strong>Release to open</strong>
          <span>Your drawing stays in this browser session.</span>
        </div>
      </div>
    </main>

    <footer v-if="!isViewerOpen" class="footer">
      <div>© 2026 Drafyx</div>
      <div class="recent" v-if="recentFiles.length">
        Recent in this session:
        <span v-for="file in recentFiles" :key="file.name">{{ file.name }}</span>
      </div>
      <div>Made for fast CAD review</div>
    </footer>
  </div>
</template>
