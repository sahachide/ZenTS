import type { Connection } from 'typeorm'
import type { Redis } from 'ioredis'
import type { SecurityStrategies } from '../types/types'
import type { SecurityStrategy } from '../security/SecurityStrategy'

export class ModuleContext {
  constructor(
    protected readonly connection: Connection,
    protected readonly redisClient: Redis,
    protected readonly securityStrategies: SecurityStrategies,
  ) {}
  public getConnection(): Connection {
    return this.connection
  }
  public hasConnection(): boolean {
    return this.connection !== null
  }
  public getRedisClient(): Redis {
    return this.redisClient
  }
  public getSecurityStrategy(key: string): SecurityStrategy {
    return this.securityStrategies.get(key)
  }
}
