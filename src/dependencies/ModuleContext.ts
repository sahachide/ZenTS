import type { Connection } from 'typeorm'
import { DB_TYPE } from '../types'
import type { DatabaseContainer } from '../database/DatabaseContainer'
import type { EmailFactory } from '../email/EmailFactory'
import type { Redis } from 'ioredis'
import type { SecurityProvider } from '../security/SecurityProvider'
import type { SecurityProviders } from '../types/types'
import type { SessionFactory } from '../security/SessionFactory'

export class ModuleContext {
  constructor(
    protected readonly databaseContainer: DatabaseContainer,
    protected readonly emailFactory: EmailFactory,
    protected readonly sessionFactory: SessionFactory,
    protected readonly securityProviders: SecurityProviders,
  ) {}
  public getConnection(): Connection {
    return this.databaseContainer.get(DB_TYPE.ORM)
  }
  public hasConnection(): boolean {
    return this.databaseContainer.has(DB_TYPE.ORM)
  }
  public getRedisClient(): Redis {
    return this.databaseContainer.get(DB_TYPE.REDIS)
  }
  public getSecurityProvider(key: string): SecurityProvider {
    return this.securityProviders.get(key)
  }
  public getSessionFactory(): SessionFactory {
    return this.sessionFactory
  }
  public getEmailFactory(): EmailFactory {
    return this.emailFactory
  }
}
