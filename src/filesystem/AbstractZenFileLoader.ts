import type { CommonJSZenModule, LoadModuleResult } from '../types/interfaces'

import { parse } from 'path'

/**
 * The AbstractZenFileLoader acts as a base class for ZenTS's loader classes (e.g. ControllerLoader).
 * It's main purpose is to supply an interface to easy load modules dynamiclly and parsing them to the
 * extending classes in a unified way. If you write a new loader, you should use this class to load the
 * Node.js modules.
 */
export abstract class AbstractZenFileLoader {
  /**
   * Load a given module and returns an unitialized version of the module. The exported class is guessed either
   * by using the default export (CommonJS) or by using the modules filename to determine the exported member.
   * This function will throw an error when no exported member could be found.
   *
   * @param filePath Absolute path to the module file
   */
  protected async loadModule<T>(filePath: string): Promise<LoadModuleResult<T>> {
    const module = (await import(filePath)) as CommonJSZenModule<T>
    const moduleKeys = Object.keys(module)
    const { name: filename } = parse(filePath)
    let classModule

    if (moduleKeys.includes('default')) {
      classModule = module.default
    } else if (moduleKeys.includes(filename)) {
      classModule = module[filename]
    } else {
      throw new Error('Unable to find the exported module member. Please use default export.')
    }

    return {
      key: filename.toLowerCase(),
      module: classModule,
    }
  }
  /**
   * Returns all method names of a class.
   *
   * @param classObjProto The prototype of a class
   */
  protected getClassMethods(classObjProto: Record<string, unknown> | null): string[] {
    if (classObjProto === Object.prototype || !classObjProto) {
      return []
    }

    return [
      ...Object.getOwnPropertyNames(classObjProto),
      ...this.getClassMethods(Object.getPrototypeOf(classObjProto)),
    ]
  }
}
