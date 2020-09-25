import type { Controllers, RouteHandler, Router } from '../types/types'

import { REQUEST_TYPE } from '../types/enums'
import type { Route } from '../types/interfaces'
import type { SessionProvider } from '../session'
import { config } from '../config/config'
import findMyWay from 'find-my-way'
import serveStatic from 'serve-static'

export class RouterFactory {
  private handler: RouteHandler

  public generate(
    controllers: Controllers,
    sessionProviders: SessionProvider[],
    handler: RouteHandler,
  ): Router {
    const router = findMyWay(config.web?.router)
    this.handler = handler

    this.bindSessionProviders(router, sessionProviders)
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
      router.on(route.method, route.path, (req, res, params) =>
        this.handler(
          {
            type: REQUEST_TYPE.CONTROLLER,
            controllerKey: key,
          },
          route,
          req,
          res,
          params,
        ),
      )
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

  protected bindSessionProviders(router: Router, sessionProviders: SessionProvider[]): void {
    for (const provider of sessionProviders) {
      router.on('POST', provider.loginRoute, (req, res, params) => {
        this.handler(
          {
            type: REQUEST_TYPE.SECURITY,
            action: 'login',
            provider,
          },
          {
            method: 'POST',
            path: provider.loginRoute,
          },
          req,
          res,
          params,
        )
      })
    }
  }
}
