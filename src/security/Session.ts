export class Session {
  constructor(public user: any | null, public provider: string) {}

  public isAuth(): boolean {
    return this.user !== null
  }
}
