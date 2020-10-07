import type { Connection } from 'typeorm'
import type { RequestConfigSecurity } from '../../types/interfaces'
import { SECURITY_ACTION } from '../../types/enums'
import type { SecurityProvider } from '../../security/SecurityProvider'
import type { SecurityRequestContext } from '../../types/types'

export class SecurityRequestHandler {
  protected provider: SecurityProvider
  protected action: SECURITY_ACTION
  private didRun: boolean = false

  constructor(
    protected context: SecurityRequestContext,
    protected connection: Connection,
    { action, provider }: RequestConfigSecurity,
  ) {
    this.provider = provider
    this.action = action
  }

  public async run(): Promise<void> {
    if (this.didRun) {
      return
    }

    this.didRun = true

    switch (this.action) {
      case SECURITY_ACTION.LOGIN:
        await this.provider.login(this.context)

        break

      case SECURITY_ACTION.LOGOUT:
        await this.provider.logout(this.context)

        break

      default:
        this.context.error.internal()
    }
  }
}
