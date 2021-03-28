import type { Controllers, HTTPMethod, Route, ValidationSchema } from '../types/'

import { AbstractZenFileLoader } from '../filesystem/AbstractZenFileLoader'
import type { Class } from 'type-fest'
import Joi from 'joi'
import { REFLECT_METADATA } from '../types/enums'
import { fs } from '../filesystem/FS'
import { log } from '../log/logger'

export class ControllerLoader extends AbstractZenFileLoader {
  public async load(): Promise<Controllers> {
    const controllers = new Map() as Controllers
    const filePaths = (
      await fs.readDir(fs.resolveZenPath('controller'))
    ).filter((filePath: string) =>
      filePath.toLowerCase().endsWith(fs.resolveZenFileExtension('controller')),
    )

    for (const filePath of filePaths) {
      const { key, module } = await this.loadModule(filePath)
      const keyMetadata = Reflect.getMetadata(REFLECT_METADATA.CONTROLLER_KEY, module) as
        | string
        | undefined
      const controllerKey =
        typeof keyMetadata !== 'string' ? key : `${keyMetadata}Controller`.toLowerCase()

      if (controllers.has(controllerKey)) {
        log.warn(`Controller with key "${controllerKey}" is already registered!`)

        continue
      }

      controllers.set(controllerKey, {
        module,
        routes: this.loadControllerRoutes(module),
      })
    }

    return controllers
  }

  protected loadControllerRoutes(classModule: Class): Route[] {
    const routes: Route[] = []
    const methods = this.getClassMethods(classModule.prototype)
    let prefix = Reflect.getMetadata(REFLECT_METADATA.URL_PREFIX, classModule) as string

    if (!prefix) {
      prefix = ''
    } else if (prefix.endsWith('/')) {
      prefix = prefix.slice(0, -1)
    }

    for (const method of methods) {
      if (method === 'constructor') {
        continue
      }

      const httpMethod = Reflect.getMetadata(
        REFLECT_METADATA.HTTP_METHOD,
        classModule.prototype,
        method,
      ) as HTTPMethod

      if (typeof httpMethod !== 'string') {
        continue
      }

      const route: Route = {
        method: httpMethod.toUpperCase() as HTTPMethod,
        path: '',
        controllerMethod: method,
      }

      let urlPath = Reflect.getMetadata(
        REFLECT_METADATA.URL_PATH,
        classModule.prototype,
        method,
      ) as string

      if (prefix.length && !urlPath.startsWith('/')) {
        urlPath = `/${urlPath}`
      }

      route.path = `${prefix}${urlPath}`

      const authProvider = Reflect.getMetadata(
        REFLECT_METADATA.AUTH_PROVIDER,
        classModule.prototype,
        method,
      ) as string

      if (typeof authProvider === 'string') {
        route.authProvider = authProvider
      }

      const validationSchema = Reflect.getMetadata(
        REFLECT_METADATA.VALIDATION_SCHEMA,
        classModule.prototype,
        method,
      ) as ValidationSchema

      if (Joi.isSchema(validationSchema)) {
        route.validationSchema = validationSchema
      }

      routes.push(route)
    }

    return routes
  }
}
