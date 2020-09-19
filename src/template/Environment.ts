import type {
  NunjucksFilterCallback,
  TemplateEngineLoaderResult,
  TemplateFiltersMap,
} from '../types/'

import type { Loader } from './Loader'
import { Environment as NunjucksEnvironment } from 'nunjucks'
import { config } from '../config/config'

export class Environment extends NunjucksEnvironment {
  constructor(loader: Loader, templateData: TemplateEngineLoaderResult) {
    super(loader, config.template)

    this.loadFilters(templateData.filters)
  }
  protected loadFilters(filters: TemplateFiltersMap): void {
    for (const [name, filter] of filters) {
      const instance = new filter.module()

      if (!filter.async) {
        this.addFilter(
          name,
          (...args: any[]) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return instance.run(...args)
          },
          false,
        )
      } else {
        this.addFilter(
          name,
          async (...args: any[]) => {
            const next = args.pop() as NunjucksFilterCallback
            let err = null
            let result

            try {
              result = (await instance.run(...args)) as unknown
            } catch (e) {
              err = e as unknown
            } finally {
              next(err, result)
            }
          },
          true,
        )
      }
    }
  }
}
