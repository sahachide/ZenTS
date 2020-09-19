import type { Controllers, RegistryFactories, Services, TemplateEngineLoaderResult } from '../types'

import type { Connection } from 'typeorm'
import { ControllerFactory } from '../controller/ControllerFactory'
import { RouterFactory } from '../router/RouterFactory'
import { ServiceFactory } from '../service/ServiceFactory'

export class Registry {
  /**
   * A reference to all ZenTS factories.
   */
  public factories: RegistryFactories

  /**
   *
   * @param controllers All controllers of a project. Usally loaded inside of the {@link Autoloader} and provided by the {@link ControllerLoader}
   * @param services  All services of a project. Usally loaded inside of the {@link Autoloader} and provided by the {@link ServiceLoader}
   * @param templateData All template and template filters of a project. Usally loaded inside of the {@link Autoloader} and provided by the {@link TemplateEngineLoader}
   * @param connection An initiated connection to a database (if enabled).
   */
  constructor(
    protected readonly controllers: Controllers = new Map() as Controllers,
    protected readonly services: Services = new Map() as Services,
    templateData: TemplateEngineLoaderResult,
    protected readonly connection: Connection | null,
  ) {
    this.factories = {
      router: new RouterFactory(),
      controller: new ControllerFactory(controllers, connection, templateData),
      service: new ServiceFactory(services, connection),
    }
  }

  /**
   * Returns all controllers the Registry knows about.
   */
  public getControllers(): Controllers {
    return this.controllers
  }

  /**
   * Returns all services the Registry knows about.
   */
  public getServices(): Services {
    return this.services
  }
  public getConnection(): Connection {
    return this.connection
  }
}
