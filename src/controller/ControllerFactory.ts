import type { Controllers, SecurityProviders, TemplateEngineLoaderResult } from '../types/'
import { Environment, Loader } from '../template/'

import { AbstractFactory } from '../core/AbstractFactory'
import type { DatabaseContainer } from '../database/DatabaseContainer'
import type { EmailFactory } from '../email/EmailFactory'
import type { SessionFactory } from '../security/SessionFactory'

export class ControllerFactory extends AbstractFactory {
  protected templateEnvironment: Environment

  constructor(
    protected readonly controllers: Controllers,
    emailFactory: EmailFactory,
    sessionFactory: SessionFactory,
    securityProviders: SecurityProviders,
    databaseContainer: DatabaseContainer,
    templateData: TemplateEngineLoaderResult,
  ) {
    super()

    const templateLoader = new Loader(templateData.files)
    this.templateEnvironment = new Environment(templateLoader, templateData)
    this.injector = this.buildInjector({
      databaseContainer,
      emailFactory,
      securityProviders,
      sessionFactory,
    })
  }

  public build<T>(key: string): T {
    const controller = this.controllers.get(key)

    if (!controller) {
      return null
    }

    const instance = this.injector.inject<T>(controller.module, [this.templateEnvironment])

    return instance
  }
}
