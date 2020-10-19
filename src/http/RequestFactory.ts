import type { RequestConfig, Route, SecurityRequestContext } from '../types/'

import type { Context } from './Context'
import { ControllerRequestHandler } from './requesthandlers/ControllerRequestHandler'
import { REQUEST_TYPE } from '../types/enums'
import type { Registry } from '../core/Registry'
import { SecurityRequestHandler } from './requesthandlers/SecurityRequestHandler'

export class RequestFactory {
  constructor(protected registry: Registry) {}

  public build(
    context: Context,
    config: RequestConfig,
    route: Route,
  ): ControllerRequestHandler | SecurityRequestHandler {
    let handler
    switch (config.type) {
      case REQUEST_TYPE.CONTROLLER:
        handler = new ControllerRequestHandler(
          context,
          this.registry.factories.controller,
          config.controllerKey,
          config.loadedUser,
          route,
        )

        break

      case REQUEST_TYPE.SECURITY:
        handler = new SecurityRequestHandler(
          context as SecurityRequestContext,
          this.registry.getConnection(),
          config,
        )

        break
    }

    return handler
  }
}
