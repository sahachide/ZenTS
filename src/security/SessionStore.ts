import type { RedisSessionStoreAdapter } from './stores/RedisSessionStoreAdapter'
import { get } from '../utils/get'
import { set } from '../utils/set'
import { unset } from '../utils/unset'

export class SessionStore {
  private isModified = false

  constructor(
    protected sessionId: string,
    protected data: Record<string, unknown>,
    protected adapter: RedisSessionStoreAdapter,
  ) {}

  public async save(): Promise<void> {
    if (!this.isModified) {
      return
    }

    await this.adapter.persist(this.sessionId, this.data)
  }

  public get<T = any>(path: string): T {
    return get(this.data, path)
  }

  public set(path: string, value: any): void {
    set(this.data, path, value)
    this.isModified = true
  }

  public remove(path: string): void {
    unset(this.data, path)
    this.isModified = true
  }
}
