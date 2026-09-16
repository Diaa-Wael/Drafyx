import {
  AcDbDatabaseConverterManager,
  AcDbFileType,
} from '@mlightcad/data-model'
import { LIBREDWG_PARSER_WORKER_FILE } from '@mlightcad/cad-simple-viewer'
import { AcDbLibreDwgConverter } from '@mlightcad/libredwg-converter'

let registered = false

export function registerLibreDwg(): void {
  if (registered) return

  const converter = new AcDbLibreDwgConverter({
    convertByEntityType: false,
    useWorker: true,
    parserWorkerUrl: `./assets/${LIBREDWG_PARSER_WORKER_FILE}`,
  })

  AcDbDatabaseConverterManager.instance.register(AcDbFileType.DWG, converter)
  registered = true
}
