import type { Connection } from 'typeorm'
import { Injector } from '../dependencies/Injector'
import { ModuleContext } from '../dependencies/ModuleContext'

export abstract class AbstractFactory {
  protected injector: Injector
  public getInjector(): Injector {
    return this.injector
  }
  protected buildInjector({ connection }: { connection: Connection }): Injector {
    const context = new ModuleContext(connection)
    const injector = new Injector(context)

    return injector
  }
}
