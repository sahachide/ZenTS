import type { JsonValue } from 'type-fest'
import { path as appDir } from 'app-root-path'
import { config } from '../config/config'
import { join } from 'path'
import { log } from '../log/logger'
import { promises } from 'fs'
import { readDirRecursive } from './readDirRecursiveGenerator'

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

  public static async readDirContentRecursive(dir: string = appDir): Promise<string[]> {
    const files = []

    for await (const file of readDirRecursive(dir)) {
      files.push(file)
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

  public static async readJson(filePath: string): Promise<JsonValue> {
    let json = null

    try {
      const content = await promises.readFile(filePath, {
        encoding: 'utf-8',
      })
      json = JSON.parse(content) as JsonValue
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

  public static appDir(): string {
    return appDir
  }

  public static isDev(): boolean {
    return process.env.NODE_ENV === 'development' || this.isTsNode
  }
}
