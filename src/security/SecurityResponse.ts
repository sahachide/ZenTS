import type { Context } from '../types/interfaces'
import type { SecurityProviderOptions } from './SecurityProviderOptions'

export class SecurityResponse {
  constructor(protected options: SecurityProviderOptions) {}

  public loginSuccess(context: Context, token: string): void {
    if (this.options.responseType === 'json') {
      return context.res
        .json({
          token,
        })
        .send()
    }

    return context.res.redirect(this.options.loginRedirectUrl)
  }

  public loginFailed(context: Context): void {
    if (this.options.responseType === 'json') {
      return context.error.forbidden('Unauthorized access', {
        detail: 'Username or password not found',
      })
    }

    return context.res.redirect(this.options.failedRedirectUrl)
  }

  public logoutSuccess(context: Context): void {
    if (this.options.responseType === 'json') {
      return context.res
        .json({
          logout: true,
        })
        .send()
    }

    return context.res.redirect(this.options.logoutRedirectUrl)
  }

  public logoutFailed(context: Context): void {
    if (this.options.responseType === 'json') {
      return context.error.badRequest('Authorization missing')
    }

    return context.res.redirect(this.options.failedRedirectUrl)
  }

  public forbidden(context: Context): void {
    if (this.options.responseType === 'json') {
      return context.error.forbidden()
    }

    return context.res.redirect(this.options.forbiddenRedirectUrl)
  }
}
