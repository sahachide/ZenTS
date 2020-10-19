import type {
  FileSessionStoreAdapterFileContent,
  SessionStoreAdapter,
} from '../../types/interfaces'

import type { DatabaseContainer } from '../../database/DatabaseContainer'
import type { SecurityProviderOptions } from '../SecurityProviderOptions'
import dayjs from 'dayjs'
import { fs } from '../../filesystem/FS'
import { join } from 'path'
import { log } from '../../log/logger'
import { promises } from 'fs'

export class FileSessionStoreAdapter implements SessionStoreAdapter {
  protected readonly folder: string
  protected readonly prefix: string
  protected readonly expire: number

  constructor(_databaseContainer: DatabaseContainer, providerOptions: SecurityProviderOptions) {
    this.folder = providerOptions.fileStoreFolder
    this.prefix = providerOptions.storePrefix
    this.expire = providerOptions.expireInMS
  }

  public async create(sessionId: string): Promise<void> {
    const filePath = this.getFilePath(sessionId)

    if (await fs.exists(filePath)) {
      const content = await fs.readJson<FileSessionStoreAdapterFileContent>(filePath)
      const expiredAt = dayjs(content.expiredAt)
      const now = dayjs()

      if (expiredAt.isAfter(now)) {
        return
      }
    }

    const data = {
      sessionId,
      data: {},
      createdAt: dayjs().toString(),
      expiredAt:
        this.expire > 0
          ? dayjs().add(this.expire, 'ms').toString()
          : dayjs().add(7, 'day').toString(),
    }

    await fs.writeJson(filePath, data)
  }

  public async load(sessionId: string): Promise<Record<string, unknown>> {
    const filePath = this.getFilePath(sessionId)
    const defaultData = {}

    if (!(await fs.exists(filePath))) {
      return defaultData
    }

    const content = await fs.readJson<FileSessionStoreAdapterFileContent>(filePath)
    const expiredAt = dayjs(content.expiredAt)
    const now = dayjs()

    if (expiredAt.isAfter(now)) {
      return defaultData
    }

    return content.data
  }

  public async persist(sessionId: string, data: Record<string, unknown>): Promise<void> {
    const filePath = this.getFilePath(sessionId)

    if (!(await fs.exists(filePath))) {
      return
    }

    const content = await fs.readJson<FileSessionStoreAdapterFileContent>(filePath)

    const expiredAt = dayjs(content.expiredAt)
    const now = dayjs()

    if (expiredAt.isAfter(now)) {
      return
    }

    content.data = data

    await fs.writeJson(filePath, data)
  }

  public async remove(sessionId: string): Promise<void> {
    const filePath = this.getFilePath(sessionId)

    if (!(await fs.exists(filePath))) {
      return
    }

    try {
      await promises.unlink(filePath)
    } catch (e) {
      log.error(e)
    }
  }

  public async has(sessionId: string): Promise<boolean> {
    const filePath = this.getFilePath(sessionId)

    if (!(await fs.exists(filePath))) {
      return false
    }

    const content = await fs.readJson<FileSessionStoreAdapterFileContent>(filePath)
    const expiredAt = dayjs(content.expiredAt)
    const now = dayjs()

    if (expiredAt.isAfter(now)) {
      return false
    }

    return true
  }

  private getFilePath(sessionId: string): string {
    return join(this.folder, fs.sanitizeFilename(`${this.prefix}${sessionId}.json`))
  }
}
