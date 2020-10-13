import type { Context, SecurityStrategy } from '../../types/interfaces'

export class HeaderSecurityStrategy implements SecurityStrategy {
  public hasToken(context: Context): boolean {
    return context.request.header.has('authorization')
  }

  public getToken(context: Context): string | false {
    const headerToken = context.request.header.get<string>('authorization')
    const splitted = headerToken.trim().split(' ')

    if (splitted.length < 2 || splitted[0].toLowerCase() !== 'bearer') {
      return false
    }

    return splitted[1]
  }

  public setToken(context: Context, token: string): void {
    context.request.header.set('token', token)
  }
}
