import type { Context } from '../http/Context'
import type { Redis } from 'ioredis'
import { RedisSessionStoreAdapter } from './stores/RedisSessionStoreAdapter'
import type { RequestConfigControllerUser } from '../types/interfaces'
import type { SecurityProviders } from '../types/types'
import { Session } from './Session'
import { SessionStore } from './SessionStore'

export class SessionFactory {
  constructor(
    protected readonly securityProviders: SecurityProviders,
    protected readonly redisClient: Redis,
  ) {}

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

    const adapter = new RedisSessionStoreAdapter(this.redisClient, securityProvider.options)
    const storeData = await adapter.load(sessionId)
    const store = new SessionStore(sessionId, storeData, adapter)
    const session = new Session(sessionId, user, store, providerKey)

    return session
  }
}
