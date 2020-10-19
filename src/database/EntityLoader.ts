import { AbstractZenFileLoader } from '../filesystem/AbstractZenFileLoader'
import type { Entities } from '../types/types'
import { config } from '../config/config'
import { fs } from '../filesystem/FS'
import { log } from '../log/logger'

export class EntityLoader extends AbstractZenFileLoader {
  public async load(): Promise<Entities> {
    const entities = new Map() as Entities

    if (!config.database?.enable) {
      return entities
    }

    const filePaths = await fs.readDir(fs.resolveZenPath('entity'), false)

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
