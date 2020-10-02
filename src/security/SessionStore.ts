export class SessionStore {
  constructor(protected adapter: any) {}

  public save() {}

  public get<T = any>(path: string): T {}

  public set(path: string, value: any): void {}

  public remove(path: string): void {}
}
