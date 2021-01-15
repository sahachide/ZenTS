import type { SecurityProviders, Services } from '../types/types'

import { AbstractFactory } from '../core/AbstractFactory'
import type { DatabaseContainer } from '../database/DatabaseContainer'
import type { EmailFactory } from '../email/EmailFactory'
import type { SessionFactory } from '../security/SessionFactory'

export class ServiceFactory extends AbstractFactory {
  constructor(
    protected services: Services,
    emailFactory: EmailFactory,
    sessionFactory: SessionFactory,
    securityProviders: SecurityProviders,
    databaseContainer: DatabaseContainer,
  ) {
    super()
    this.injector = this.buildInjector({
      databaseContainer,
      emailFactory,
      sessionFactory,
      securityProviders,
    })
  }

  public build<T>(key: string): T {
    const module = this.services.get(key)

    if (!module) {
      return null
    }
    const instance = this.injector.inject<T>(module, [])

    return instance
  }
}
