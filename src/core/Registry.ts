import type {
  Controllers,
  Entities,
  RegistryFactories,
  SecurityProviders,
  Services,
  TemplateEngineLoaderResult,
} from '../types'

import type { Connection } from 'typeorm'
import { ControllerFactory } from '../controller/ControllerFactory'
import type { Redis } from 'ioredis'
import { RequestFactory } from '../http/RequestFactory'
import { RouterFactory } from '../router/RouterFactory'
import { ServiceFactory } from '../service/ServiceFactory'
import { SessionFactory } from '../security/SessionFactory'

export class Registry {
  public factories: RegistryFactories

  constructor(
    protected readonly controllers: Controllers,
    protected readonly services: Services,
    templateData: TemplateEngineLoaderResult,
    protected readonly entities: Entities,
    protected readonly connection: Connection | null,
    protected readonly redisClient: Redis,
    protected readonly securityProviders: SecurityProviders,
  ) {
    const sessionFactory = new SessionFactory(securityProviders, redisClient)

    this.factories = {
      router: new RouterFactory(),
      controller: new ControllerFactory(
        controllers,
        sessionFactory,
        securityProviders,
        connection,
        redisClient,
        templateData,
      ),
      request: new RequestFactory(this),
      service: new ServiceFactory(
        services,
        sessionFactory,
        securityProviders,
        connection,
        redisClient,
      ),
      session: sessionFactory,
    }
  }

  public getControllers(): Controllers {
    return this.controllers
  }

  public getServices(): Services {
    return this.services
  }

  public getEntities(): Entities {
    return this.entities
  }

  public getConnection(): Connection {
    return this.connection
  }

  public getRedisClient(): Redis {
    return this.redisClient
  }

  public getSecurityProviders(): SecurityProviders {
    return this.securityProviders
  }
}
