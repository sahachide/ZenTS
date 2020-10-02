import type { Connection } from 'typeorm'
import { Injector } from '../dependencies/Injector'
import { ModuleContext } from '../dependencies/ModuleContext'
import type { Redis } from 'ioredis'
import type { SecurityProviders } from '../types/types'
import type { SessionFactory } from '../security/SessionFactory'

export abstract class AbstractFactory {
  protected injector: Injector

  public getInjector(): Injector {
    return this.injector
  }

  protected buildInjector({
    connection,
    redisClient,
    securityProviders,
    sessionFactory,
  }: {
    connection: Connection
    redisClient: Redis
    securityProviders: SecurityProviders
    sessionFactory: SessionFactory
  }): Injector {
    const context = new ModuleContext(connection, redisClient, sessionFactory, securityProviders)
    const injector = new Injector(context)

    return injector
  }
}
