import type { DatabaseContainer } from '../database/DatabaseContainer'
import { Injector } from '../dependencies/Injector'
import { ModuleContext } from '../dependencies/ModuleContext'
import type { SecurityProviders } from '../types/types'
import type { SessionFactory } from '../security/SessionFactory'

export abstract class AbstractFactory {
  protected injector: Injector

  public getInjector(): Injector {
    return this.injector
  }

  protected buildInjector({
    databaseContainer,
    securityProviders,
    sessionFactory,
  }: {
    databaseContainer: DatabaseContainer
    securityProviders: SecurityProviders
    sessionFactory: SessionFactory
  }): Injector {
    const context = new ModuleContext(databaseContainer, sessionFactory, securityProviders)
    const injector = new Injector(context)

    return injector
  }
}
