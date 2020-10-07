import type {
  Controllers,
  Entities,
  SecurityProviders,
  Services,
  TemplateEngineLoaderResult,
} from '../types/'

import type { Connection } from 'typeorm'
import { ControllerLoader } from '../controller/ControllerLoader'
import { EntityLoader } from '../database/EntityLoader'
import type { Redis } from 'ioredis'
import { Registry } from './Registry'
import { SecurityProviderLoader } from '../security/SecurityProviderLoader'
import { ServiceLoader } from '../service/ServiceLoader'
import { TemplateEngineLoader } from '../template/TemplateEngineLoader'
import { createConnection } from '../database/createConnection'
import { createRedisClient } from '../database/createRedisClient'

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
    const securityProviders = this.loadSecurityProviders(entities, connection, redisClient)
    const registry = new Registry(
      controllers,
      services,
      templateData,
      entities,
      connection,
      redisClient,
      securityProviders,
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

  protected loadSecurityProviders(
    entities: Entities,
    connection: Connection,
    redisClient: Redis,
  ): SecurityProviders {
    const securityProviderLoader = new SecurityProviderLoader()

    return securityProviderLoader.load(entities, connection, redisClient)
  }
}
