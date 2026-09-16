import {
  AcDbDatabaseConverterManager,
  AcDbFileType,
} from '@mlightcad/data-model'
import { AcDbLibreDwgConverter } from '@mlightcad/libredwg-converter'

let registered = false

export function registerLibreDwg(): void {
  if (registered) return

  const converter = new AcDbLibreDwgConverter({
    useWorker: true,
    parserWorkerUrl: './assets/libredwg-parser-worker.js',
  })

  AcDbDatabaseConverterManager.instance.register(AcDbFileType.DWG, converter)
  registered = true
}
