import type { IncomingMessage, ServerResponse } from 'http'
import type { IncomingParams, Route } from '../types/interfaces'
import type { RequestConfig, SecurityStrategies } from '../types/types'

import { Context } from './Context'
import { RequestAuthenticator } from '../security/RequestAuthenticator'
import type { RequestFactory } from './RequestFactory'

export class IncomingRequest {
  public async handle(
    factory: RequestFactory,
    securityStrategies: SecurityStrategies,
    config: RequestConfig,
    route: Route,
    req: IncomingMessage,
    res: ServerResponse,
    params: IncomingParams,
  ): Promise<void> {
    const context = await this.buildContext(req, res, params)
    let isAuth = true

    if (typeof route.authStrategy === 'string') {
      const requestAuthenticator = new RequestAuthenticator(
        securityStrategies.get(route.authStrategy),
      )

      isAuth = await requestAuthenticator.authenticate(context)
    }

    if (isAuth) {
      const handler = factory.build(context, config, route)
      await handler.run()
    }
  }

  protected async buildContext(
    req: IncomingMessage,
    res: ServerResponse,
    params: IncomingParams,
  ): Promise<Context> {
    const context = new Context()

    await context.build(req, res, params)

    return context
  }
}
