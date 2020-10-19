import { config, loadConfig } from '../config/config'
import { createLogger, log } from '../log/logger'

import { AutoLoader } from './AutoLoader'
import type { Server as NodeHttpServer } from 'http'
import type { Server as NodeHttpsServer } from 'https'
import type { Registry } from './Registry'
import { Server } from '../http/Server'
import type { ZenConfig } from '../types/interfaces'
import { validateInstallation } from '../filesystem/validateInstallation'

export class ZenApp {
  /**
   * Inidicates if the application has completly booted.
   */
  public isBooted: boolean = false

  /**
   * A reference to an initialized {@link Registry}.
   */
  public registry: Registry

  public nodeServer: NodeHttpsServer | NodeHttpServer

  /**
   * This function boots the entire application, prepares the config, Registry and starts the webserver.
   */
  public async boot(config?: ZenConfig): Promise<void> {
    await loadConfig(config)
    createLogger()
    await validateInstallation()

    const autoloader = new AutoLoader()
    this.registry = await autoloader.createRegistry()

    await this.startServer()
    this.isBooted = true
  }

  public destroy(): void {
    this.nodeServer.close()
  }

  /**
   * Creates a new webserver, which can be configured inside the config.web property (see {@link config} for more details)
   */
  protected async startServer(): Promise<void> {
    return new Promise((resolve) => {
      const server = new Server(this.registry)

      this.nodeServer = server.listen(
        {
          host: config.web.host,
          port: config.web.port,
        },
        () => {
          log.success(`ZenTS web-server listening on http://${config.web.host}:${config.web.port}`)

          resolve()
        },
      )
    })
  }
}
