import type { Context } from '../http/Context'
import type { RequestConfigControllerUser } from '../types/interfaces'
import type { SecurityProviders } from '../types/types'
import { Session } from './Session'

export class SessionFactory {
  constructor(protected readonly securityProviders: SecurityProviders) {}

  public async build(
    providerKey: string,
    context: Context,
    previouslyLoadedUser?: RequestConfigControllerUser,
  ): Promise<Session> {
    const securityProvider = this.securityProviders.get(providerKey)
    let user = null
    let sessionId: string

    if (typeof previouslyLoadedUser !== 'undefined') {
      user = previouslyLoadedUser.user
      sessionId = previouslyLoadedUser.sessionId
    } else {
      const authorize = await securityProvider.authorize(context)

      if (authorize.isAuth) {
        user = authorize.user
        sessionId = authorize.sessionId
      }
    }

    if (typeof sessionId !== 'string') {
      sessionId = securityProvider.generateSessionId()
    }

    const session = new Session(user, providerKey)

    return session
  }
}
