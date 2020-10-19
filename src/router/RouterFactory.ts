import type { Controllers, RouteHandler, Router, SecurityProviders } from '../types/types'
import { REQUEST_TYPE, SECURITY_ACTION } from '../types/enums'
import type { RequestConfigController, Route } from '../types/interfaces'

import { config } from '../config/config'
import findMyWay from 'find-my-way'
import serveStatic from 'serve-static'

export class RouterFactory {
  private handler: RouteHandler

  public generate(
    controllers: Controllers,
    securityProviders: SecurityProviders,
    handler: RouteHandler,
  ): Router {
    const router = findMyWay(config.web?.router)
    this.handler = handler

    this.bindSecurityProviderRoutes(router, securityProviders)
    this.bindStaticRoute(router)

    for (const [key, controllerDeclaration] of controllers) {
      this.bindController(router, key, controllerDeclaration.routes)
    }

    return router
  }

  protected bindController(
    router: findMyWay.Instance<findMyWay.HTTPVersion.V1>,
    key: string,
    routes: Route[],
  ): void {
    for (const route of routes) {
      router.on(route.method, route.path, (req, res, params) => {
        const handlerConfig: RequestConfigController = {
          type: REQUEST_TYPE.CONTROLLER,
          controllerMethod: route.controllerMethod,
          controllerKey: key,
        }

        if (typeof route.authProvider === 'string') {
          handlerConfig.authProvider = route.authProvider
        }

        this.handler(handlerConfig, route, req, res, params)
      })
    }
  }

  protected bindStaticRoute(router: Router): void {
    if (typeof config.paths?.public !== 'string' || typeof config.web?.publicPath !== 'string') {
      return
    }

    const handler = serveStatic(config.paths.public)

    let publicRoutePath = config.web?.publicPath
    if (!publicRoutePath.startsWith('/')) {
      publicRoutePath = `/${publicRoutePath}`
    }
    if (!publicRoutePath.endsWith('/')) {
      publicRoutePath = `${publicRoutePath}/`
    }

    router.on('GET', `${publicRoutePath}*`, (req, res) => {
      req.url = req.url.substr(publicRoutePath.length)

      // @ts-ignore
      handler(req, res, () => {
        res.setHeader('Content-Type', 'application/json')
        res.writeHead(404)
        res.end(
          JSON.stringify({
            statusCode: 404,
            error: 'Not Found',
            message: 'File not found',
          }),
        )
      })
    })
  }

  protected bindSecurityProviderRoutes(router: Router, securityProviders: SecurityProviders): void {
    for (const provider of securityProviders.values()) {
      const options = provider.options

      if (typeof options.loginUrl === 'string') {
        router.on('POST', options.loginUrl, (req, res, params) => {
          this.handler(
            {
              type: REQUEST_TYPE.SECURITY,
              action: SECURITY_ACTION.LOGIN,
              provider,
            },
            {
              method: 'POST',
              path: options.loginUrl,
            },
            req,
            res,
            params,
          )
        })
      }

      if (typeof options.logoutUrl === 'string') {
        router.on('GET', options.logoutUrl, (req, res, params) => {
          this.handler(
            {
              type: REQUEST_TYPE.SECURITY,
              action: SECURITY_ACTION.LOGOUT,
              provider,
            },
            {
              method: 'GET',
              path: options.logoutUrl,
            },
            req,
            res,
            params,
          )
        })
      }
    }
  }
}
