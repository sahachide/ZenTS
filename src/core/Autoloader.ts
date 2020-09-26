import type { Controllers, Entities, Services, TemplateEngineLoaderResult } from '../types/'

import { ControllerLoader } from '../controller/ControllerLoader'
import { EntityLoader } from '../database/EntityLoader'
import { Registry } from './Registry'
import { ServiceLoader } from '../service/ServiceLoader'
import { SessionProvider } from '../session/SessionProvider'
import { TemplateEngineLoader } from '../template/TemplateEngineLoader'
import { config } from '../config'
import { createConnection } from '../database/createConnection'
import { createRedisClient } from '../database/createRedisClient'
import { isObject } from '../utils/isObject'

export class Autoloader {
  public async createRegistry(): Promise<Registry> {
    const [
      controllers,
      services,
      templateData,
      entities,
      connection,
      redisClient,
    ] = await Promise.all([
      this.loadControllers(),
      this.loadServices(),
      this.loadTemplateData(),
      this.loadEntities(),
      createConnection(),
      createRedisClient(),
    ])
    const sessionProviders = this.loadSessionProviders(entities)
    const registry = new Registry(
      controllers,
      services,
      templateData,
      entities,
      connection,
      redisClient,
      sessionProviders,
    )

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

  protected async loadEntities(): Promise<Entities> {
    const entityLoader = new EntityLoader()

    return await entityLoader.load()
  }

  protected loadSessionProviders(entities: Entities): SessionProvider[] {
    if (!isObject(config.session) || !config.session.enable) {
      return []
    }

    const providers = []

    for (const providerConfig of config.session.providers) {
      const entity = entities.get(providerConfig.entity)
      const provider = new SessionProvider(entity, providerConfig)

      providers.push(provider)
    }

    return providers
  }
}
