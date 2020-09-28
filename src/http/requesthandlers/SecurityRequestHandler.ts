import type { Connection } from 'typeorm'
import type { RequestConfigSecurity } from '../../types/interfaces'
import { SECURITY_ACTION } from '../../types/enums'
import type { SecurityRequestContext } from '../../types/types'
import type { SecurityStrategy } from '../../security/SecurityStrategy'

export class SecurityRequestHandler {
  protected strategy: SecurityStrategy
  protected action: SECURITY_ACTION
  private didRun: boolean = false

  constructor(
    protected context: SecurityRequestContext,
    protected connection: Connection,
    { action, strategy }: RequestConfigSecurity,
  ) {
    this.strategy = strategy
    this.action = action
  }

  public async run(): Promise<void> {
    if (this.didRun) {
      return
    }

    this.didRun = true

    switch (this.action) {
      case SECURITY_ACTION.LOGIN:
        await this.login()
        break
    }
  }

  protected async login(): Promise<void> {
    await this.strategy.login(this.context)
  }
}
