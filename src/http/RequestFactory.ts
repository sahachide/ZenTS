import type { IncomingMessage, ServerResponse } from 'http'
import type { IncomingParams, RequestConfig, Route } from '../types/'

import { Context } from './Context'
import { ControllerRequestHandler } from './requesthandlers/ControllerRequestHandler'
import { REQUEST_TYPE } from '../types/enums'
import type { Registry } from '../core/Registry'
import { SecurityRequestHandler } from './requesthandlers/SecurityRequestHandler'

export class RequestFactory {
  constructor(protected registry: Registry) {}
  public async build(
    config: RequestConfig,
    req: IncomingMessage,
    res: ServerResponse,
    params: IncomingParams,
    route: Route,
  ): Promise<ControllerRequestHandler | SecurityRequestHandler> {
    const context = new Context()
    let handler

    await context.build(req, res, params)

    switch (config.type) {
      case REQUEST_TYPE.CONTROLLER:
        handler = new ControllerRequestHandler(
          context,
          this.registry.factories.controller,
          config.controllerKey,
          route,
        )
        break

      case REQUEST_TYPE.SECURITY:
        handler = new SecurityRequestHandler(context, config.provider)
    }

    return handler
  }
}
