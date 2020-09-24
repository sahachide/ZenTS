import type { Connection } from 'typeorm'
import type { Redis } from 'ioredis'

export class ModuleContext {
  constructor(protected readonly connection: Connection, protected readonly redisClient: Redis) {}
  public getConnection(): Connection {
    return this.connection
  }
  public hasConnection(): boolean {
    return this.connection !== null
  }
  public getRedisClient(): Redis {
    return this.redisClient
  }
}
