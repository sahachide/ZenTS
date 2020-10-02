import type { Context } from '../http/Context'
import type { SecurityStrategy } from './SecurityStrategy'

export class RequestAuthenticator {
  constructor(protected securityStrategy: SecurityStrategy) {}

  public async authenticate(context: Context): Promise<boolean> {
    if (typeof this.securityStrategy === 'undefined') {
      return false
    }

    return await this.securityStrategy.verify(context)
  }
}
