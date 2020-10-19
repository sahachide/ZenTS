import type { Context } from '../http/Context'
import type { DatabaseContainer } from '../database/DatabaseContainer'
import type { RequestConfigControllerUser } from '../types/interfaces'
import type { SecurityProviders } from '../types/types'
import { Session } from './Session'
import { SessionStore } from './SessionStore'
import { SessionStoreAdapterFactory } from './SessionStoreAdapterFactory'

export class SessionFactory {
  protected storeFactory: SessionStoreAdapterFactory
  constructor(
    protected readonly securityProviders: SecurityProviders,
    databaseContainer: DatabaseContainer,
  ) {
    this.storeFactory = new SessionStoreAdapterFactory(databaseContainer)
  }

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

    const adapter = this.storeFactory.build(securityProvider.options)
    const storeData = await adapter.load(sessionId)
    const store = new SessionStore(sessionId, storeData, adapter)
    const session = new Session(sessionId, user, store, adapter, providerKey)

    return session
  }
}
