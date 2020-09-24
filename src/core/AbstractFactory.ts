import type { Connection } from 'typeorm'
import { Injector } from '../dependencies/Injector'
import { ModuleContext } from '../dependencies/ModuleContext'
import type { Redis } from 'ioredis'

export abstract class AbstractFactory {
  protected injector: Injector
  public getInjector(): Injector {
    return this.injector
  }
  protected buildInjector({
    connection,
    redisClient,
  }: {
    connection: Connection
    redisClient: Redis
  }): Injector {
    const context = new ModuleContext(connection, redisClient)
    const injector = new Injector(context)

    return injector
  }
}
