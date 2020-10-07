import type { Redis } from 'ioredis'
import type { SecurityProviderOptions } from '../SecurityProviderOptions'
import { log } from '../../log/logger'

export class RedisSessionStoreAdapter {
  private prefix: string
  private expire: number
  private keepTTL: boolean

  constructor(protected readonly redisClient: Redis, providerOptions: SecurityProviderOptions) {
    this.prefix = providerOptions.redisStorePrefix
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

      if (this.keepTTL) {
        options.push('KEEPTTL')
      }
    }

    await this.redisClient.set(prefixedSessionId, '{}', ...options)
  }

  public async load(sessionId: string): Promise<Record<string, unknown>> {
    const record = await this.redisClient.get(this.getPrefixedSessionId(sessionId))

    if (!record || !record.length) {
      return {}
    }

    let data = {}

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
