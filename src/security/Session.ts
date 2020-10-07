import type { SessionStore } from './SessionStore'

export class Session {
  constructor(
    public id: string,
    public user: any | null,
    public data: SessionStore,
    public provider: string,
  ) {}

  public isAuth(): boolean {
    return this.user !== null
  }
}
