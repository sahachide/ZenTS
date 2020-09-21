import type { Controllers, TemplateEngineLoaderResult } from '../types/'
import { Environment, Loader } from '../template/'

import { AbstractFactory } from '../core/AbstractFactory'
import type { Connection } from 'typeorm'

/**
 * The ControllerFactory exposes functions to create a new controller instance (including injected dependencies).
 * Usally you don't initalize a new ControllerFactory by yourself. If you need to access the factory use the {@link Registry} instead.
 */
export class ControllerFactory extends AbstractFactory {
  /**
   * Reference to the initialized nunjucks template enviroment
   */
  protected templateEnvironment: Environment

  /**
   * @param controllers A Map of autoloaded controller modules (see {@link Autoloader})
   * @param connection An initiated connection to a database (if enabled).
   * @param templateData
   */
  constructor(
    protected controllers: Controllers,
    protected connection: Connection | null,
    templateData: TemplateEngineLoaderResult,
  ) {
    super()

    const templateLoader = new Loader(templateData.files)
    this.templateEnvironment = new Environment(templateLoader, templateData)
    this.injector = this.buildInjector({ connection })
  }

  /**
   * Build a new instance of a controller and auto inject it's dependencies.
   *
   * @param key The key of the controller. That's either its filename or the exported member.
   */
  public build<T>(key: string): T {
    const controller = this.controllers.get(key)

    if (!controller) {
      return null
    }

    const instance = this.injector.inject<T>(controller.module, [this.templateEnvironment])

    return instance
  }
}
