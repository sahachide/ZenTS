import type { Context, SecurityStrategy } from '../../types/interfaces'

import { config } from '../../config/config'

export class CookieSecurityStrategy implements SecurityStrategy {
  get cookieKey(): string {
    return config.security?.cookieKey ?? 'zenapp_jwt'
  }

  public hasToken(context: Context): boolean {
    return context.cookie.has(this.cookieKey)
  }

  public getToken(context: Context): string {
    return context.cookie.get<string>(this.cookieKey)
  }

  public setToken(context: Context, token: string): void {
    context.cookie.set(this.cookieKey, token)
  }
}
