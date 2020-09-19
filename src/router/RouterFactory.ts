import type { ControllerRoute } from '../types/interfaces'
import type { Controllers } from '../types/types'
import { RouteHandler } from '../types/types'
import { config } from '../config/config'
import findMyWay from 'find-my-way'
import serveStatic from 'serve-static'

export class RouterFactory {
  private handler: RouteHandler
  public generate(
    controllers: Controllers,
    handler: RouteHandler,
  ): findMyWay.Instance<findMyWay.HTTPVersion.V1> {
    const router = findMyWay(config.web?.router)
    this.handler = handler

    this.bindStaticRoute(router)

    for (const [key, controllerDeclaration] of controllers) {
      this.bindController(router, key, controllerDeclaration.routes)
    }

    return router
  }
  protected bindController(
    router: findMyWay.Instance<findMyWay.HTTPVersion.V1>,
    key: string,
    routes: ControllerRoute[],
  ): void {
    for (const route of routes) {
      router.on(route.method, route.path, (req, res, params) =>
        this.handler(key, route, req, res, params),
      )
    }
  }
  protected bindStaticRoute(router: findMyWay.Instance<findMyWay.HTTPVersion.V1>): void {
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
}
