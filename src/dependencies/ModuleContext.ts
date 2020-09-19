import type { Connection } from 'typeorm'

export class ModuleContext {
  constructor(protected connection: Connection) {}
  public getConnection(): Connection {
    return this.connection
  }
  public hasConnection(): boolean {
    return this.connection !== null
  }
}
