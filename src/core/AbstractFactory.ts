import type { Connection } from 'typeorm'
import { Injector } from '../dependencies/Injector'
import { ModuleContext } from '../dependencies/ModuleContext'
import type { Redis } from 'ioredis'
import type { SecurityStrategies } from '../types/types'

export abstract class AbstractFactory {
  protected injector: Injector
  public getInjector(): Injector {
    return this.injector
  }
  protected buildInjector({
    connection,
    redisClient,
    securityStrategies,
  }: {
    connection: Connection
    redisClient: Redis
    securityStrategies: SecurityStrategies
  }): Injector {
    const context = new ModuleContext(connection, redisClient, securityStrategies)
    const injector = new Injector(context)

    return injector
  }
}
