import { path as appDir } from 'app-root-path'
import { config } from '../config/config'
import { join } from 'path'
import { promises } from 'fs'
import { readDirRecursive } from './readDirRecursiveGenerator'

/**
 * The fs helper class is a wrapper around various filesystem function (e.g. by using Node.js internal fs module) and
 * utilizes async / await syntax. All functions supplied by this class should be static, because this (abstract) class
 * will never be initialized.
 */

export abstract class fs {
  // @ts-ignore
  public static isTsNode = !!process[Symbol.for('ts-node.register.instance')]

  /**
   * Checks if the given path / file exists.
   *
   * @param pathToDirOrFile A absolute path to a file or folder
   */
  public static async exists(pathToDirOrFile: string): Promise<boolean> {
    let success = true

    try {
      await promises.access(pathToDirOrFile)
    } catch (error) {
      success = false
    }

    return success
  }
  /**
   *  Recursive reads all content of the given directory.
   *
   * @param dir A absolute path to a folder
   */
  public static async readDirContentRecursive(dir: string = appDir): Promise<string[]> {
    const files = []

    for await (const file of readDirRecursive(dir)) {
      files.push(file)
    }

    return files
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

  /**
   * Returns the absolute path to the project folder which started the ZenTS application.
   */
  public static appDir(): string {
    return appDir
  }

  public static isDev(): boolean {
    return process.env.NODE_ENV === 'development' || this.isTsNode
  }
}
