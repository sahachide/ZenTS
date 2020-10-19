import type {
  Controllers,
  Entities,
  SecurityProviders,
  Services,
  TemplateEngineLoaderResult,
} from '../types/'

import { ControllerLoader } from '../controller/ControllerLoader'
import { DatabaseContainer } from '../database/DatabaseContainer'
import { EntityLoader } from '../database/EntityLoader'
import { Registry } from './Registry'
import { SecurityProviderLoader } from '../security/SecurityProviderLoader'
import { ServiceLoader } from '../service/ServiceLoader'
import { TemplateEngineLoader } from '../template/TemplateEngineLoader'
import { createConnection } from '../database/createConnection'
import { createRedisClient } from '../database/createRedisClient'

export class AutoLoader {
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

    const databaseContainer = new DatabaseContainer(connection, redisClient)

    const securityProviders = this.loadSecurityProviders(entities, databaseContainer)
    const registry = new Registry(
      controllers,
      services,
      templateData,
      databaseContainer,
      entities,
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
    databaseContainer: DatabaseContainer,
  ): SecurityProviders {
    const securityProviderLoader = new SecurityProviderLoader()

    return securityProviderLoader.load(entities, databaseContainer)
  }
}
