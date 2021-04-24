import type { IncomingMessage, ServerResponse } from 'http'
import type { IncomingParams, IncomingRequestAuthenticateResult, Route } from '../types/interfaces'
import type { RequestConfig, SecurityProviders } from '../types/types'

import { Context } from './Context'
import { REQUEST_TYPE } from '../types/enums'
import type { RequestFactory } from './RequestFactory'
import { config } from '../config'

export class IncomingRequest {
  public async handle(
    factory: RequestFactory,
    route: Route,
    req: IncomingMessage,
    res: ServerResponse,
    params: IncomingParams,
    requestConfig: RequestConfig,
    securityProviders: SecurityProviders,
  ): Promise<void> {
    const context = await this.buildContext(req, res, params, route)
    const authentication = await this.authenticate(route.authProvider, context, securityProviders)

    if (authentication.isAuth) {
      if (requestConfig.type === REQUEST_TYPE.CONTROLLER) {
        requestConfig.loadedUser = {
          provider: route.authProvider,
          user: authentication.user,
          sessionId: authentication.sessionId,
        }
      }

      if (context.isValid) {
        const handler = factory.build(context, requestConfig, route)

        await handler.run()
      } else {
        context.error.badData('Bad Data', {
          errors: context.validationErrors,
        })
      }
    } else if (authentication.securityProvider) {
      await authentication.securityProvider.forbidden(context)
    } else {
      context.error.forbidden()
    }
  }

  protected async buildContext(
    req: IncomingMessage,
    res: ServerResponse,
    params: IncomingParams,
    route: Route,
  ): Promise<Context> {
    const context = new Context()

    await context.build(req, res, params, route)

    return context
  }

  protected async authenticate(
    authProvider: unknown,
    context: Context,
    securityProviders: SecurityProviders,
  ): Promise<IncomingRequestAuthenticateResult> {
    if (!config.security?.enable || typeof authProvider !== 'string') {
      return {
        isAuth: true,
      }
    }

    const securityProvider = securityProviders.get(authProvider)

    if (typeof securityProviders === 'undefined') {
      return {
        isAuth: false,
      }
    }

    const authorize = await securityProvider.authorize(context)

    return {
      isAuth: authorize.isAuth,
      user: authorize.user,
      sessionId: authorize.sessionId,
      securityProvider,
    }
  }
}
