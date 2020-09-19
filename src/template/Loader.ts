import type { ILoader, LoaderSource } from 'nunjucks'
import { join, parse, sep } from 'path'

import type { LoaderTemplates } from '../types/types'
import { config } from '../config/config'
import { fs } from '../filesystem/FS'
import { readFileSync } from 'fs'

export class Loader implements ILoader {
  protected templates: LoaderTemplates = new Map() as LoaderTemplates
  constructor(templateFiles: string[]) {
    const files = templateFiles.map((filePath) => parse(filePath))
    let basePath = fs.resolveZenPath('view')

    if (basePath.endsWith(sep)) {
      basePath = basePath.slice(0, -1)
    }

    for (const file of files) {
      const filePath = join(file.dir, file.base)
      let key = file.dir.replace(basePath, '').substr(1).replace(sep, '/')
      key += key.length ? `/${file.name}` : file.name

      this.templates.set(key, {
        path: filePath,
        src: readFileSync(filePath, {
          encoding: config.template.encoding,
        }),
        noCache: config.template.noCache ?? false,
      })
    }
  }
  public getSource(key: string): LoaderSource {
    return this.templates.get(key)
  }
}
