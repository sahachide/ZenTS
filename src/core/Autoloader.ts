import type {
  Controllers,
  Entities,
  SecurityStrategies,
  Services,
  TemplateEngineLoaderResult,
} from '../types/'

import type { Connection } from 'typeorm'
import { ControllerLoader } from '../controller/ControllerLoader'
import { EntityLoader } from '../database/EntityLoader'
import { Registry } from './Registry'
import { SecurityStrategyLoader } from '../security/SecurityStrategyLoader'
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
    const securityStrategies = this.loadSecurityStrategies(entities, connection)
    const registry = new Registry(
      controllers,
      services,
      templateData,
      entities,
      connection,
      redisClient,
      securityStrategies,
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

  protected loadSecurityStrategies(entities: Entities, connection: Connection): SecurityStrategies {
    const securityStrategyLoader = new SecurityStrategyLoader()

    return securityStrategyLoader.load(entities, connection)
  }
}
