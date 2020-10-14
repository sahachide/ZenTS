import {
  Controllers,
  DB_TYPE,
  Entities,
  RegistryFactories,
  SecurityProviders,
  Services,
  TemplateEngineLoaderResult,
} from '../types'

import type { Connection } from 'typeorm'
import { ControllerFactory } from '../controller/ControllerFactory'
import { DatabaseContainer } from '../database/DatabaseContainer'
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
    protected readonly databaseContainer: DatabaseContainer,
    protected readonly entities: Entities,
    protected readonly securityProviders: SecurityProviders,
  ) {
    const sessionFactory = new SessionFactory(securityProviders, databaseContainer)

    this.factories = {
      router: new RouterFactory(),
      controller: new ControllerFactory(
        controllers,
        sessionFactory,
        securityProviders,
        databaseContainer,
        templateData,
      ),
      request: new RequestFactory(this),
      service: new ServiceFactory(services, sessionFactory, securityProviders, databaseContainer),
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
    return this.databaseContainer.get(DB_TYPE.ORM)
  }

  public getRedisClient(): Redis {
    return this.databaseContainer.get(DB_TYPE.REDIS)
  }

  public getSecurityProviders(): SecurityProviders {
    return this.securityProviders
  }
}
