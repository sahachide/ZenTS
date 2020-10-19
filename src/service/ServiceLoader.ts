import { AbstractZenFileLoader } from '../filesystem/AbstractZenFileLoader'
import type { Services } from '../types/types'
import { fs } from '../filesystem'

export class ServiceLoader extends AbstractZenFileLoader {
  public async load(): Promise<Services> {
    const services = new Map() as Services

    if (!(await fs.exists(fs.resolveZenPath('service')))) {
      return services
    }

    const filePaths = (await fs.readDir(fs.resolveZenPath('service'))).filter((filePath: string) =>
      filePath.toLowerCase().endsWith(fs.resolveZenFileExtension('service')),
    )

    for (const filePath of filePaths) {
      const { key, module } = await this.loadModule(filePath)

      services.set(key, module)
    }

    return services
  }
}
