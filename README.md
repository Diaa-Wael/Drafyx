# Drafyx

Browser-based CAD viewer for local DWG and DXF files.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Vercel

Use the Vite preset, with `npm run build` as the build command and `dist` as the output directory.

## CAD processing

Drafyx uses MLightCAD's browser CAD viewer and LibreDWG WebAssembly for the local DWG path. A selected drawing is passed to the viewer as a browser `File`; Drafyx does not include an application upload API or a CAD-processing backend.

## MLightCAD dependencies

The full `@mlightcad/cad-viewer` package statically references its first-party lazy plugin registration modules. Even when Drafyx does not expose PDF, SVG, HTML export, or AI-agent features, those registration packages must be installed so Vite/Rollup can resolve the viewer's imports during a production build.

Installed first-party packages:

- `@mlightcad/cad-agent-plugin` 1.6.3
- `@mlightcad/cad-html-plugin` 1.7.0
- `@mlightcad/cad-pdf-plugin` 1.7.0
- `@mlightcad/cad-svg-plugin` 1.7.0
- `@mlightcad/cad-simple-viewer` 1.7.0
- `@mlightcad/cad-viewer` 1.7.0
- `@mlightcad/data-model` 1.14.6
- `@mlightcad/libredwg-converter` 3.14.6

The optional feature packages are installed for module resolution/lazy registration; Drafyx does not invoke the AI agent or PDF/SVG/HTML commands.

## Runtime assets

The Vite config copies the CAD worker/WASM/runtime files into `public/assets` before dev/build so they are served locally by Vite/Vercel.

## Privacy note

Drafyx is designed around local browser processing. Hosting the frontend on Vercel does not by itself create a DWG upload endpoint. As always, verify the production deployment in the browser Network panel before publishing a privacy claim.

## License

Drafyx application code is MIT. LibreDWG is GPL-3.0; review licensing requirements before redistributing a production build that includes the LibreDWG converter.
