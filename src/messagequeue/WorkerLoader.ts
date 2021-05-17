import { AbstractZenFileLoader } from '../filesystem/AbstractZenFileLoader'
import type { Worker } from './Worker'
import type { Workers } from '../types/types'
import { config } from '../config/config'
import { fs } from '../filesystem/FS'

export class WorkerLoader extends AbstractZenFileLoader {
  public async load(): Promise<Workers> {
    const workers = new Map<string, Worker>()
    const filesPath = fs.resolveZenPath('worker')

    if (
      !config.mq?.enable ||
      !Array.isArray(config.mq?.queues) ||
      !config.redis?.enable ||
      !(await fs.exists(filesPath))
    ) {
      return workers
    }

    const filePaths = (await fs.readDir(filesPath)).filter((filePath: string) =>
      filePath.toLowerCase().endsWith(fs.resolveZenFileExtension('worker')),
    )

    for (const filePath of filePaths) {
      const { key, module } = await this.loadModule(filePath)

      workers.set(key, (module as unknown) as Worker)
    }

    return workers
  }
}
