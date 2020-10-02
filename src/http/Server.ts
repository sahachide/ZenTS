import type { HTTPVersion, Instance as RouterInstance } from 'find-my-way'
import type { IncomingMessage, Server as NodeHttpServer, ServerResponse } from 'http'

import type { Controllers } from '../types/types'
import { IncomingRequest } from './IncomingRequest'
import type { Server as NodeHttpsServer } from 'https'
import type { Registry } from '../core/Registry'
import { config } from '../config/config'
import { createServer as createHttpServer } from 'http'
import { createServer as createHttpsServer } from 'https'

export class Server {
  public router: RouterInstance<HTTPVersion.V1>
  protected controllers: Controllers
  constructor(registry: Registry) {
    const securityStrategies = registry.getSecurityStrategies()

    this.controllers = registry.getControllers()
    this.router = registry.factories.router.generate(
      this.controllers,
      securityStrategies,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (config, route, req, res, params): Promise<void> => {
        const incomingRequest = new IncomingRequest()

        await incomingRequest.handle(
          registry.factories.request,
          securityStrategies,
          config,
          route,
          req,
          res,
          params,
        )
      },
    )
  }
  public listen(...args: any[]): NodeHttpServer | NodeHttpsServer {
    const server = !config.web.https.enable
      ? createHttpServer(this.createRequestHandler())
      : this.createHttpsServer()

    return server.listen(...args)
  }
  protected createRequestHandler(): (req: IncomingMessage, res: ServerResponse) => void {
    const handler = (req: IncomingMessage, res: ServerResponse): void =>
      this.router.lookup(req, res)

    return handler
  }
  protected createHttpsServer(): NodeHttpsServer {
    const usePem =
      typeof config.web?.https?.key !== 'undefined' &&
      typeof config.web?.https?.cert !== 'undefined'
    const usePfx =
      typeof config.web?.https?.pfx !== 'undefined' &&
      typeof config.web?.https?.passphrase !== 'undefined'

    if (!usePem && !usePfx) {
      throw new Error(
        'Either https.key and https.cert or https.pfx and https.passphrase has to be defined in config when using https server',
      )
    }
    const options = usePem
      ? {
          key: config.web.https.key,
          cert: config.web.https.cert,
        }
      : {
          pfx: config.web.https.pfx,
          passphrase: config.web.https.passphrase,
        }

    return createHttpsServer(options, this.createRequestHandler())
  }
}
