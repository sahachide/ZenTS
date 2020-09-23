import { AbstractFactory } from '../core/AbstractFactory'
import type { Connection } from 'typeorm'
import type { Redis } from 'ioredis'
import type { Services } from '../types/types'

export class ServiceFactory extends AbstractFactory {
  constructor(
    protected services: Services,
    protected readonly connection: Connection,
    protected readonly redisClient: Redis,
  ) {
    super()
    this.injector = this.buildInjector({ connection, redisClient })
  }
  public build<T>(key: string): T {
    const module = this.services.get(key)

    if (!module) {
      return null
    }
    const instance = this.injector.inject<T>(module, [])

    return instance
  }
}
