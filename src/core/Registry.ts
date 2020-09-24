import type { Controllers, RegistryFactories, Services, TemplateEngineLoaderResult } from '../types'

import type { Connection } from 'typeorm'
import { ControllerFactory } from '../controller/ControllerFactory'
import type { Redis } from 'ioredis'
import { RouterFactory } from '../router/RouterFactory'
import { ServiceFactory } from '../service/ServiceFactory'
import type { SessionProvider } from '../session/SessionProvider'

export class Registry {
  public factories: RegistryFactories

  constructor(
    protected readonly controllers: Controllers,
    protected readonly services: Services,
    templateData: TemplateEngineLoaderResult,
    protected readonly connection: Connection | null,
    protected readonly redisClient: Redis,
    protected readonly sessionProviders: SessionProvider[],
  ) {
    this.factories = {
      router: new RouterFactory(),
      controller: new ControllerFactory(controllers, connection, redisClient, templateData),
      service: new ServiceFactory(services, connection, redisClient),
    }
  }

  public getControllers(): Controllers {
    return this.controllers
  }

  public getServices(): Services {
    return this.services
  }

  public getConnection(): Connection {
    return this.connection
  }

  public getRedisClient(): Redis {
    return this.redisClient
  }

  public getSessionProviders(): SessionProvider[] {
    return this.sessionProviders
  }
}
