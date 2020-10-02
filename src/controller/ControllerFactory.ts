import type { Controllers, SecurityProviders, TemplateEngineLoaderResult } from '../types/'
import { Environment, Loader } from '../template/'

import { AbstractFactory } from '../core/AbstractFactory'
import type { Connection } from 'typeorm'
import type { Redis } from 'ioredis'
import type { SessionFactory } from '../security/SessionFactory'

export class ControllerFactory extends AbstractFactory {
  protected templateEnvironment: Environment

  constructor(
    protected readonly controllers: Controllers,
    sessionFactory: SessionFactory,
    securityProviders: SecurityProviders,
    connection: Connection | null,
    redisClient: Redis,
    templateData: TemplateEngineLoaderResult,
  ) {
    super()

    const templateLoader = new Loader(templateData.files)
    this.templateEnvironment = new Environment(templateLoader, templateData)
    this.injector = this.buildInjector({
      connection,
      redisClient,
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
