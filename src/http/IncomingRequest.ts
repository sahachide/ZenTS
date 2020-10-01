import type { IncomingMessage, ServerResponse } from 'http'
import type { IncomingParams, Route } from '../types/interfaces'

import { Context } from './Context'
import type { RequestConfig } from '../types/types'
import type { RequestFactory } from './RequestFactory'

export class IncomingRequest {
  public async handle(
    factory: RequestFactory,
    config: RequestConfig,
    route: Route,
    req: IncomingMessage,
    res: ServerResponse,
    params: IncomingParams,
  ): Promise<void> {
    const context = new Context()

    await context.build(req, res, params)
  }
}
