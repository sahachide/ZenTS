import type { Connection } from 'typeorm'
import { Context } from '../Context'
import type { JsonObject } from 'type-fest'
import type { RequestConfigSecurity } from '../../types/interfaces'
import { SECURITY_ACTION } from '../../types/enums'
import type { SessionProvider } from '../../session/SessionProvider'

export class SecurityRequestHandler {
  protected provider: SessionProvider
  protected action: SECURITY_ACTION
  private didRun: boolean = false

  constructor(
    protected context: Context,
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
        await this.login()
        break
    }
  }

  protected async login(): Promise<void> {
    const body = this.context.body as JsonObject
    const username = body[this.provider.usernameField] as string
    const password = body[this.provider.passwordField] as string

    if (
      typeof username !== 'string' ||
      !username.length ||
      typeof password !== 'string' ||
      !password.length
    ) {
      return
    }

    const repository = this.connection.getRepository(this.provider.entity)
    const user = await repository.findOne({
      username,
    })
  }
}
