// Drafyx keeps the core browser CAD viewer lean. These optional MLightCAD
// plugins are intentionally not installed; these no-op exports satisfy the
// viewer's optional peer imports without adding AI/PDF/HTML features.

export function registerLazyAgentPlugin(): void {}
export function registerLazyHtmlPlugin(): void {}
export function registerLazyPdfPlugin(): void {}

export default {}
