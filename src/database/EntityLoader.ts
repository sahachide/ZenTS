import { AbstractZenFileLoader } from '../filesystem/AbstractZenFileLoader'
import type { Entities } from '../types/types'
import { fs } from '../filesystem/FS'
import { log } from '../log/logger'

export class EntityLoader extends AbstractZenFileLoader {
  public async load(): Promise<Entities> {
    const entities = new Map() as Entities
    const filePaths = await fs.readDirContentRecursive(fs.resolveZenPath('entity'))

    for (const filePath of filePaths) {
      const { key, module } = await this.loadModule(filePath)

      if (entities.has(key)) {
        log.warn(`Entity with key "${key}" is already registered!`)

        continue
      }

      entities.set(key, module)
    }

    return entities
  }
}
