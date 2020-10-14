import type { DatabaseContainer } from '../../database/DatabaseContainer'
import type { SecurityProviderOptions } from '../SecurityProviderOptions'
import type { SessionStoreAdapter } from '../../types/interfaces'
import { fs } from '../../filesystem/FS'
import { join } from 'path'

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
    }
  }

  public async load(sessionId: string): Promise<Record<string, unknown>> {}

  public async persist(sessionId: string, data: Record<string, unknown>): Promise<void> {}

  public async remove(sessionId: string): Promise<void> {}

  public async has(sessionId: string): Promise<boolean> {}

  private getFilePath(sessionId: string): string {
    return join(this.folder, fs.sanitizeFilename(`${this.prefix}${sessionId}.json`))
  }
}
