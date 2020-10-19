import type { Connection } from 'typeorm'
import { DB_TYPE } from '../types/enums'
import type { DatabaseObjectType } from '../types/types'
import type { Redis } from 'ioredis'

export class DatabaseContainer {
  protected container = new Map<DB_TYPE, Connection | Redis>()

  constructor(dbConnection: Connection | null, redisClient: Redis | null) {
    if (dbConnection) {
      this.container.set(DB_TYPE.ORM, dbConnection)
    }

    if (redisClient) {
      this.container.set(DB_TYPE.REDIS, redisClient)
    }
  }

  public get<T extends DB_TYPE>(type: T): DatabaseObjectType<T> {
    return this.container.get(type) as DatabaseObjectType<T>
  }

  public has(type: DB_TYPE): boolean {
    return this.container.has(type)
  }
}
