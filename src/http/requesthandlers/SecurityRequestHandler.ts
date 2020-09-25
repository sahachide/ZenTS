import { Context } from '../Context'
import type { RequestConfigSecurity } from '../../types/interfaces'
import { SECURITY_ACTION } from '../../types/enums'
import type { SessionProvider } from '../../session/SessionProvider'

export class SecurityRequestHandler {
  protected provider: SessionProvider
  protected action: SECURITY_ACTION

  private didRun: boolean = false
  constructor(protected context: Context, config: RequestConfigSecurity) {
    this.provider = config.provider
    this.action = config.action
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
  protected async login(): Promise<void> {}
}
