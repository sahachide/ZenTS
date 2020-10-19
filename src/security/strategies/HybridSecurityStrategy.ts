import type { Context, SecurityStrategy } from '../../types/interfaces'

import { CookieSecurityStrategy } from './CookieSecurityStrategy'
import { HeaderSecurityStrategy } from './HeaderSecurityStrategy'

export class HybridSecurityStrategy implements SecurityStrategy {
  protected headerSecurityStrategy: HeaderSecurityStrategy
  protected cookieSecurityStrategy: CookieSecurityStrategy

  constructor() {
    this.headerSecurityStrategy = new HeaderSecurityStrategy()
    this.cookieSecurityStrategy = new CookieSecurityStrategy()
  }

  public hasToken(context: Context): boolean {
    return (
      this.headerSecurityStrategy.hasToken(context) || this.cookieSecurityStrategy.hasToken(context)
    )
  }

  public getToken(context: Context): string | false {
    const headerResult = this.headerSecurityStrategy.getToken(context)

    if (typeof headerResult === 'string') {
      return headerResult
    }

    return this.cookieSecurityStrategy.getToken(context)
  }

  public setToken(context: Context, token: string): void {
    this.headerSecurityStrategy.setToken(context, token)
    this.cookieSecurityStrategy.setToken(context, token)
  }
}
