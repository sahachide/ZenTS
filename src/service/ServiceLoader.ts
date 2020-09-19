import { AbstractZenFileLoader } from '../filesystem/AbstractZenFileLoader'
import type { Services } from '../types/types'
import { fs } from '../filesystem'

export class ServiceLoader extends AbstractZenFileLoader {
  protected services: Services = new Map() as Services
  public async load(): Promise<Services> {
    if (!(await fs.exists(fs.resolveZenPath('service')))) {
      return this.services
    }

    const filePaths = (
      await fs.readDirContentRecursive(fs.resolveZenPath('service'))
    ).filter((filePath: string) =>
      filePath.toLowerCase().endsWith(fs.resolveZenFileExtension('service')),
    )

    for (const filePath of filePaths) {
      const { key, module } = await this.loadModule(filePath)

      this.services.set(key, module)
    }

    return this.services
  }
}
