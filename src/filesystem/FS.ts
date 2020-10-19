import { join, resolve } from 'path'

import { path as appDir } from 'app-root-path'
import { config } from '../config/config'
import { log } from '../log/logger'
import { promises } from 'fs'
import { readDirRecursive } from './readDirRecursiveGenerator'

const illegalRegEx = /[/?<>\\:*|"]/g
// eslint-disable-next-line no-control-regex
const controlRegEx = /[\x00-\x1f\x80-\x9f]/g
const reservedRegEx = /^\.+$/
const windowsReservedRegEx = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i
const windowsTrailingRegEx = /[. ]+$/

export abstract class fs {
  // @ts-ignore
  public static isTsNode = !!process[Symbol.for('ts-node.register.instance')]

  public static async exists(pathToDirOrFile: string): Promise<boolean> {
    let success = true

    try {
      await promises.access(pathToDirOrFile)
    } catch (error) {
      success = false
    }

    return success
  }

  public static async readDir(dir: string, recursive: boolean = true): Promise<string[]> {
    const files = []

    if (recursive) {
      for await (const file of readDirRecursive(dir)) {
        files.push(file)
      }
    } else {
      const dirContent = await promises.readdir(dir, {
        withFileTypes: true,
      })

      for (const content of dirContent) {
        if (content.isFile()) {
          files.push(resolve(dir, content.name))
        }
      }
    }

    return files
  }

  public static async writeJson(filePath: string, json: Record<string, unknown>): Promise<boolean> {
    let success = true

    try {
      await promises.writeFile(filePath, JSON.stringify(json))
    } catch (e) {
      success = false
      log.error(e)
    }

    return success
  }

  public static async readJson<T>(filePath: string): Promise<T> {
    let json = null

    try {
      const content = await promises.readFile(filePath, {
        encoding: 'utf-8',
      })
      json = JSON.parse(content) as T
    } catch (e) {
      log.error(e)
    }

    return json
  }

  public static resolveZenPath(key: string): string {
    const basePath = !this.isDev() ? config.paths.base.dist : config.paths.base.src
    const paths = config.paths as { [key: string]: string }

    return join(basePath, paths[key])
  }

  public static resolveZenFileExtension(filename?: string): string {
    if (!filename) {
      return !this.isDev() ? '.js' : '.ts'
    }

    return !this.isDev() ? `${filename}.js` : `${filename}.ts`
  }

  public static sanitizeFilename(filename: string): string {
    const sanitized = filename
      .replace(illegalRegEx, '')
      .replace(controlRegEx, '')
      .replace(reservedRegEx, '')
      .replace(windowsReservedRegEx, '')
      .replace(windowsTrailingRegEx, '')

    return sanitized.substring(0, 255)
  }

  public static appDir(): string {
    return appDir
  }

  public static isDev(): boolean {
    return process.env.NODE_ENV === 'development' || this.isTsNode
  }
}
