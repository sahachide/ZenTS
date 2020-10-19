import type { SessionStore } from './SessionStore'
import type { SessionStoreAdapter } from '../types/interfaces'

export class Session {
  constructor(
    public id: string,
    public user: any | null,
    public data: SessionStore,
    public adapter: SessionStoreAdapter,
    public provider: string,
  ) {}

  public isAuth(): boolean {
    return this.user !== null
  }

  public async destroy(): Promise<void> {
    await this.adapter.remove(this.id)
    this.id = null
    this.user = null
    this.data = null
    this.provider = null
    this.adapter = null
  }
}
