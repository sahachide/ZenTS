import type {
  Controllers,
  EmailTemplates,
  Entities,
  RegistryFactories,
  SecurityProviders,
  Services,
  TemplateEngineLoaderResult,
  Workers,
} from '../types'

import type { Connection } from 'typeorm'
import { ControllerFactory } from '../controller/ControllerFactory'
import { DB_TYPE } from '../types'
import { DatabaseContainer } from '../database/DatabaseContainer'
import { EmailFactory } from '../email'
import { QueueFactory } from '../messagequeue/QueueFactory'
import type { Redis } from 'ioredis'
import { RequestFactory } from '../http/RequestFactory'
import { RouterFactory } from '../router/RouterFactory'
import { ServiceFactory } from '../service/ServiceFactory'
import { SessionFactory } from '../security/SessionFactory'
import { WorkerFactory } from '../messagequeue/WorkerFactory'

export class Registry {
  public factories: RegistryFactories

  constructor(
    protected readonly controllers: Controllers,
    protected readonly services: Services,
    templateData: TemplateEngineLoaderResult,
    emailTemplates: EmailTemplates,
    protected readonly databaseContainer: DatabaseContainer,
    protected readonly entities: Entities,
    workers: Workers,
    protected readonly securityProviders: SecurityProviders,
  ) {
    const sessionFactory = new SessionFactory(securityProviders, databaseContainer)
    const emailFactory = new EmailFactory(emailTemplates)

    this.factories = {
      router: new RouterFactory(),
      controller: new ControllerFactory(
        controllers,
        emailFactory,
        sessionFactory,
        securityProviders,
        databaseContainer,
        templateData,
      ),
      request: new RequestFactory(this),
      service: new ServiceFactory(
        services,
        emailFactory,
        sessionFactory,
        securityProviders,
        databaseContainer,
      ),
      session: sessionFactory,
      email: emailFactory,
      queue: new QueueFactory(this.getRedisClient()),
      worker: new WorkerFactory(workers),
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
