import type { DatabaseSessionStoreAdapterEntity, SessionStoreAdapter } from '../../types/interfaces'
import { MoreThan, Repository } from 'typeorm'

import { DB_TYPE } from '../../types/enums'
import type { DatabaseContainer } from '../../database/DatabaseContainer'
import type { DatabaseSessionStoreAdapterEntityClass } from '../../types/types'
import type { SecurityProviderOptions } from '../SecurityProviderOptions'
import dayjs from 'dayjs'
import { log } from '../../log/logger'

export class DatabaseSessionStoreAdapter implements SessionStoreAdapter {
  protected readonly repository: Repository<DatabaseSessionStoreAdapterEntity>
  protected readonly entity: DatabaseSessionStoreAdapterEntityClass
  protected readonly expire: number

  constructor(databaseContainer: DatabaseContainer, providerOptions: SecurityProviderOptions) {
    this.repository = databaseContainer
      .get(DB_TYPE.ORM)
      .getRepository<DatabaseSessionStoreAdapterEntity>(providerOptions.dbStoreEntity)
    this.entity = providerOptions.dbStoreEntity as DatabaseSessionStoreAdapterEntityClass
    this.expire = providerOptions.expireInMS
  }

  public async create(sessionId: string): Promise<void> {
    const record = await this.getRecord(sessionId)

    if (record) {
      return
    }

    const session = new this.entity()

    session.id = sessionId
    session.data = JSON.stringify({})
    session.created_at = new Date()
    session.expired_at =
      this.expire > 0 ? dayjs().add(this.expire, 'ms').toDate() : dayjs().add(7, 'day').toDate()

    await this.repository.save(session)
  }

  public async load(sessionId: string): Promise<Record<string, unknown>> {
    const record = await this.getRecord(sessionId)
    let data = {}

    if (!record) {
      return data
    }

    try {
      data = JSON.parse(record.data) as Record<string, unknown>
    } catch (e) {
      log.error(e)
    }

    return data
  }

  public async persist(sessionId: string, data: Record<string, unknown>): Promise<void> {
    let record: string

    try {
      record = JSON.stringify(data)
    } catch (e) {
      record = '{}'
      log.error(e)
    }

    await this.repository.update(
      {
        id: sessionId,
      },
      {
        data: record,
      },
    )
  }

  public async remove(sessionId: string): Promise<void> {
    await this.repository.delete({
      id: sessionId,
    })
  }

  public async has(sessionId: string): Promise<boolean> {
    return !!(await this.getRecord(sessionId))
  }

  protected async getRecord(sessionId: string): Promise<DatabaseSessionStoreAdapterEntity> {
    return await this.repository.findOne({
      id: sessionId,
      expired_at: MoreThan(new Date()),
    })
  }
}
