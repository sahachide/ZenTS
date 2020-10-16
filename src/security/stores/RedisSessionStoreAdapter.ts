import { DB_TYPE } from '../../types/enums'
import type { DatabaseContainer } from '../../database/DatabaseContainer'
import type { Redis } from 'ioredis'
import type { SecurityProviderOptions } from '../SecurityProviderOptions'
import type { SessionStoreAdapter } from '../../types/interfaces'
import { log } from '../../log/logger'
import ms from 'ms'

export class RedisSessionStoreAdapter implements SessionStoreAdapter {
  protected readonly redisClient: Redis
  protected readonly prefix: string
  protected readonly expire: number
  protected readonly keepTTL: boolean

  constructor(databaseContainer: DatabaseContainer, providerOptions: SecurityProviderOptions) {
    this.redisClient = databaseContainer.get(DB_TYPE.REDIS)
    this.prefix = providerOptions.storePrefix
    this.expire = providerOptions.expireInMS
    this.keepTTL = providerOptions.redisKeepTTL
  }

  public async create(sessionId: string): Promise<void> {
    const prefixedSessionId = this.getPrefixedSessionId(sessionId)
    const record = await this.redisClient.get(prefixedSessionId)

    if (record) {
      return
    }

    const options: any[] = []

    if (this.expire !== -1) {
      options.push('PX', this.expire)
    } else {
      options.push('PX', ms('7d'))
    }

    if (this.keepTTL) {
      options.push('KEEPTTL')
    }

    await this.redisClient.set(prefixedSessionId, '{}', ...options)
  }

  public async load(sessionId: string): Promise<Record<string, unknown>> {
    const record = await this.redisClient.get(this.getPrefixedSessionId(sessionId))

    let data = {}

    if (!record || !record.length) {
      return data
    }

    try {
      data = JSON.parse(record) as Record<string, unknown>
    } catch (e) {
      data = {}
      log.error(e)
    }

    return data
  }

  public async persist(sessionId: string, data: Record<string, unknown>): Promise<void> {
    let record: string

    try {
      record = JSON.stringify(data)
    } catch (e) {
      record = ''
      log.error(e)
    }

    await this.redisClient.set(this.getPrefixedSessionId(sessionId), record)
  }

  public async remove(sessionId: string): Promise<void> {
    if (!(await this.has(sessionId))) {
      return
    }

    await this.redisClient.del(this.getPrefixedSessionId(sessionId))
  }

  public async has(sessionId: string): Promise<boolean> {
    return !!(await this.redisClient.exists(this.getPrefixedSessionId(sessionId)))
  }

  private getPrefixedSessionId(sessionId: string): string {
    return `${this.prefix}${sessionId}`
  }
}
