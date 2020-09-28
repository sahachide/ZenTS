import type { SecurityStrategies, Services } from '../types/types'

import { AbstractFactory } from '../core/AbstractFactory'
import type { Connection } from 'typeorm'
import type { Redis } from 'ioredis'

export class ServiceFactory extends AbstractFactory {
  constructor(
    protected services: Services,
    securityStrategies: SecurityStrategies,
    connection: Connection,
    redisClient: Redis,
  ) {
    super()
    this.injector = this.buildInjector({ connection, redisClient, securityStrategies })
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
