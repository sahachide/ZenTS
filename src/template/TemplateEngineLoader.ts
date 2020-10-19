import { AbstractZenFileLoader, fs } from '../filesystem'
import type {
  TemplateEngineLoaderResult,
  TemplateFilter,
  TemplateFiltersMap,
  TemplateStaticFilterModule,
} from '../types/'

import { config } from '../config/config'
import { join } from 'path'
import { log } from '../log/logger'

export class TemplateEngineLoader extends AbstractZenFileLoader {
  public async load(): Promise<TemplateEngineLoaderResult> {
    const [files, filters] = await Promise.all([this.loadFiles(), this.loadFilters()])

    return {
      files,
      filters,
    }
  }
  protected async loadFiles(): Promise<string[]> {
    return (await fs.readDir(fs.resolveZenPath('view'))).filter((filePath: string) =>
      filePath.endsWith(`.${config.template.extension}`),
    )
  }
  protected async loadFilters(): Promise<TemplateFiltersMap> {
    const filters = new Map() as TemplateFiltersMap
    const dir = join(fs.resolveZenPath('template'), 'filter')

    if (!(await fs.exists(dir))) {
      return filters
    }

    const filePaths = (await fs.readDir(dir)).filter((filePath: string) =>
      filePath.endsWith(fs.resolveZenFileExtension()),
    )

    for (const filePath of filePaths) {
      const { key, module } = await this.loadModule<TemplateFilter>(filePath)
      const filterModule = module as TemplateStaticFilterModule
      const name = typeof filterModule.filtername === 'string' ? filterModule.filtername : key

      if (filters.has(name)) {
        log.warn(`Template filter "${name}" has already been set. Skipping...`)
        continue
      }

      filters.set(name, {
        async: filterModule.async ?? false,
        module,
      })
    }

    return filters
  }
}
