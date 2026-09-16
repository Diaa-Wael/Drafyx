# Drafyx — Browser CAD Viewer

Drafyx is a browser-first, mobile-friendly 2D CAD viewer for opening and inspecting AutoCAD-style drawings directly in modern web browsers — without requiring desktop CAD software.

The project is designed for phones, tablets, laptops, and desktop browsers, with local file opening as the primary workflow.

## Features

- Open local **DWG** and **DXF** files from the browser.
- Desktop drag-and-drop file opening.
- Responsive UI designed for touch screens as well as mouse/trackpad use.
- CAD viewport with zoom, pan, and inspection controls provided by the embedded CAD viewer.
- Viewer-side drawing/entity/layer inspection capabilities.
- Built-in sample DXF workflow for testing the interface without finding a CAD file first.
- No application-specific upload server is included; local files are passed into the browser viewer.
- Vite production build configuration that copies the required viewer workers and DWG WebAssembly assets.

## Tech stack

- **Vue 3** + TypeScript
- **Vite**
- **Element Plus** for interface components
- **MLightCAD CAD Viewer** for browser CAD rendering/parsing
- **LibreDWG WebAssembly converter** for DWG support

## Requirements

- Node.js **22+**
- npm
- A current Chrome, Edge, Firefox, or Safari browser

## Getting started

Clone or extract the project, then run:

```bash
npm install
npm run dev
```

Open the local address printed by Vite.

### Production build

```bash
npm run typecheck
npm run build
npm run preview
```

The production files are written to `dist/`.

## Project structure

```text
Drafyx/
├── public/
├── src/
│   ├── App.vue                 # Main Drafyx application shell
│   ├── main.ts                 # Vue application bootstrap
│   ├── registerLibreDwg.ts     # DWG converter registration
│   └── styles.css              # Responsive Drafyx UI styles
├── .gitignore
├── env.d.ts
├── index.html
├── LICENSE
├── package.json
├── tsconfig.json
├── vite.config.ts              # Worker/WASM asset configuration
└── README.md
```

## Supported CAD formats

Drafyx is currently focused on **DWG** and **DXF** files used by AutoCAD and compatible CAD workflows.

CAD compatibility is ultimately determined by the parser and the entities/features present in a drawing. Very advanced AutoCAD features may have different support than a full desktop CAD application.

## Privacy / file handling

Drafyx's local-file workflow uses the browser's `File` APIs and does not include a custom file-upload endpoint.

That means a normal local inspection session does not require sending the drawing to a Drafyx backend. Supporting resources required by the viewer may still be loaded by the web application according to the viewer configuration.

For confidential engineering drawings, review your deployment architecture and browser/network policies before using any hosted instance.

## DWG licensing note

The Drafyx application code is released under the MIT license in this repository.

However, the DWG path uses `@mlightcad/libredwg-converter`, which is GPL-3.0 licensed. This matters when distributing Drafyx as a closed-source or commercial application. Review the licenses of all dependencies and choose a DWG parsing solution that matches your intended distribution model.

## Git setup

After extracting the ZIP:

```bash
git init
git add .
git commit -m "Initial Drafyx CAD viewer"
```

The included `.gitignore` excludes dependencies, build artifacts, local environment files, logs, IDE settings, and operating-system metadata.

## Deployment

Drafyx is structured as a client-side Vite application and can be deployed to a static hosting platform after building:

```bash
npm run build
```

Deploy the contents of `dist/` to your chosen static host.

Because the app uses browser workers and WebAssembly for parts of the CAD stack, make sure your hosting platform serves JavaScript worker files and `.wasm` assets correctly.

## Future product directions

Drafyx can be expanded into a full review platform with features such as drawing libraries, share links, annotations, measurements, comments, version history, thumbnails, authentication, cloud storage, PDF export, and drawing comparison.

## Upstream projects

- MLightCAD CAD Viewer: https://github.com/mlightcad/cad-viewer
- MLightCAD CAD Simple Viewer Example: https://github.com/mlightcad/cad-simple-viewer-example
- LibreDWG converter package: https://www.npmjs.com/package/@mlightcad/libredwg-converter

## DWG loading

Drafyx uses `@mlightcad/cad-viewer` for the Vue CAD workspace. DXF parsing is built into the MLightCAD data model; DWG support is registered explicitly with `@mlightcad/libredwg-converter` and its parser Web Worker/WASM assets. The Vite config copies the worker and `libredwg-web.wasm` into `dist/assets`, matching the documented integration.

The app passes the selected browser `File` directly to the viewer through the `local-file` prop, so opening a drawing does not require uploading it to a Drafyx backend.

## License

See [LICENSE](./LICENSE).


## Troubleshooting: DWG opens with a worker error

If Vite reports an `__vite-optional-peer-dep` error or a DWG parse error with `Worker error: undefined`, stop the dev server and clear Vite's optimized-dependency cache:

```powershell
Remove-Item -Recurse -Force node_modules/.vite -ErrorAction SilentlyContinue
npm run dev -- --force
```

Drafyx resolves the LibreDWG parser worker against the browser document URL and serves the worker/WASM assets from `/assets`. The official MLightCAD integration requires the parser worker and `libredwg-web.wasm` to be deployed as browser-accessible assets.

## UI layout

Drafyx uses a compact application header above the CAD workspace. The CAD viewer toolbar remains inside the drawing viewport, while the app header provides file-level actions. The layout tightens further on phones to preserve drawing area and prevent toolbar overlap.

### MLightCAD optional plugins

Drafyx includes the MLightCAD agent, HTML, and PDF plugin packages because `@mlightcad/cad-viewer` can resolve their lazy registration entry points at runtime. The official MLightCAD example lists `@mlightcad/cad-pdf-plugin` alongside the agent and HTML plugins for a full viewer integration. See the project package.json for the pinned versions.
