import type { Connection } from 'typeorm'
import type { Redis } from 'ioredis'
import type { SecurityProvider } from '../security/SecurityProvider'
import type { SecurityProviders } from '../types/types'
import type { SessionFactory } from '../security/SessionFactory'

export class ModuleContext {
  constructor(
    protected readonly connection: Connection,
    protected readonly redisClient: Redis,
    protected readonly sessionFactory: SessionFactory,
    protected readonly securityProviders: SecurityProviders,
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
  public getSecurityProvider(key: string): SecurityProvider {
    return this.securityProviders.get(key)
  }
  public getSessionFactory(): SessionFactory {
    return this.sessionFactory
  }
}
