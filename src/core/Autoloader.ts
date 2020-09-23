import type { Controllers, Services, TemplateEngineLoaderResult } from '../types/'

import { ControllerLoader } from '../controller/ControllerLoader'
import { Registry } from './Registry'
import { ServiceLoader } from '../service/ServiceLoader'
import { TemplateEngineLoader } from '../template/TemplateEngineLoader'
import { createConnection } from '../database/createConnection'
import { createRedisClient } from '../database/createRedisClient'

export class Autoloader {
  public async createRegistry(): Promise<Registry> {
    const [controllers, services, templateData, connection, redisClient] = await Promise.all([
      this.loadControllers(),
      this.loadServices(),
      this.loadTemplateData(),
      createConnection(),
      createRedisClient(),
    ])

    const registry = new Registry(controllers, services, templateData, connection, redisClient)

    return registry
  }

  protected async loadControllers(): Promise<Controllers> {
    const controllerLoader = new ControllerLoader()

    return await controllerLoader.load()
  }

  protected async loadServices(): Promise<Services> {
    const serviceLoader = new ServiceLoader()

    return await serviceLoader.load()
  }

  protected async loadTemplateData(): Promise<TemplateEngineLoaderResult> {
    const templateEngineLoader = new TemplateEngineLoader()

    return await templateEngineLoader.load()
  }
}
