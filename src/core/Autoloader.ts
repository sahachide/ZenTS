import type { Controllers, Services, TemplateEngineLoaderResult } from '../types/'

import { ControllerLoader } from '../controller/ControllerLoader'
import { Registry } from './Registry'
import { ServiceLoader } from '../service/ServiceLoader'
import { TemplateEngineLoader } from '../template/TemplateEngineLoader'
import { createConnection } from '../database/createConnection'

/**
 * The Autoloader is used to load all project files (e.g. Controller, Services, Templates, ...)
 * via various Loaders. It returns a initialized {@link Registry}, which can be later used to
 * access the modules / files. You usally don't want to initialze a Autoloader by yourself, as this
 * is handled internally.
 */
export class Autoloader {
  /**
   * Creates and returns the {@link Registry}. The Registry will hold all modules (e.g. Controller, Services, ...)
   * and is bound to a instance of {@link ZenApp}.
   */
  public async createRegistry(): Promise<Registry> {
    const [controllers, services, templateData, connection] = await Promise.all([
      this.loadControllers(),
      this.loadServices(),
      this.loadTemplateData(),
      createConnection(),
    ])

    const registry = new Registry(controllers, services, templateData, connection)

    return registry
  }

  /**
   * Create a instance of {@link ControllerLoader} and return a collection
   * of all controllers inside a project.
   */
  protected async loadControllers(): Promise<Controllers> {
    const controllerLoader = new ControllerLoader()

    return await controllerLoader.load()
  }

  /**
   * Create a instance of {@link ServiceLoader} and return a collection
   * of all services inside a project.
   */
  protected async loadServices(): Promise<Services> {
    const serviceLoader = new ServiceLoader()

    return await serviceLoader.load()
  }

  /**
   * Create a instance of {@link TemplateEngineLoader} and return a collection
   * of all templates / filters inside a project.
   */
  protected async loadTemplateData(): Promise<TemplateEngineLoaderResult> {
    const templateEngineLoader = new TemplateEngineLoader()

    return await templateEngineLoader.load()
  }
}
