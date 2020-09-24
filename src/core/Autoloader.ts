import type { Controllers, Services, TemplateEngineLoaderResult } from '../types/'

import { ControllerLoader } from '../controller/ControllerLoader'
import { Registry } from './Registry'
import { ServiceLoader } from '../service/ServiceLoader'
import { SessionProvider } from '../session/SessionProvider'
import { TemplateEngineLoader } from '../template/TemplateEngineLoader'
import { config } from '../config'
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
    const sessionProviders = this.loadSessionProviders()
    const registry = new Registry(
      controllers,
      services,
      templateData,
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

  protected loadSessionProviders(): SessionProvider[] {
    if (config.session?.enable) {
      return []
    }

    const providers = []

    for (const providerConfig of config.session.providers) {
      const provider = new SessionProvider(providerConfig)

      providers.push(provider)
    }

    return providers
  }
}
