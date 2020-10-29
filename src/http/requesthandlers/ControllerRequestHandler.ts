import type {
  ControllerMethodReturnType,
  GenericControllerInstance,
  RequestConfigControllerUser,
  Route,
} from '../../types'

import { Context } from '../Context'
import { ControllerFactory } from '../../controller/ControllerFactory'
import { Injector } from '../../dependencies/Injector'
import type { JsonObject } from 'type-fest'
import type { Session } from '../../security/Session'
import { TemplateResponse } from '../../template/TemplateResponse'
import { isObject } from '../../utils/isObject'

export class ControllerRequestHandler {
  protected controllerInstance: GenericControllerInstance
  protected controllerMethod: string
  protected injector: Injector

  private didRun: boolean = false

  constructor(
    protected readonly context: Context,
    controllerFactory: ControllerFactory,
    controllerKey: string,
    protected readonly loadedUser: RequestConfigControllerUser,
    { controllerMethod }: Route,
  ) {
    this.controllerInstance = controllerFactory.build<GenericControllerInstance>(controllerKey)
    this.controllerMethod = controllerMethod
    this.injector = controllerFactory.getInjector()
  }

  public async run(): Promise<void> {
    if (this.didRun) {
      return
    } else if (typeof this.controllerInstance[this.controllerMethod] !== 'function') {
      throw new Error(`Fatal Error: ${this.controllerMethod} isn't a function.`)
    }

    this.didRun = true
    const injectedSessions: Session[] = []
    const injectedParameters = await this.injector.injectFunctionParameters(
      this.controllerInstance,
      this.controllerMethod,
      this.context,
      this.loadedUser,
      injectedSessions,
    )
    const result = await this.controllerInstance[this.controllerMethod](...injectedParameters)

    if (!this.context.res.isSend) {
      this.handleResult(result)
    }

    await this.saveSessionStores(injectedSessions)
  }

  protected handleResult(result: ControllerMethodReturnType): void {
    if (!result) {
      return
    }

    if (this.context.req.httpMethod === 'post' && !this.context.res.isStatuscodeSetManual) {
      this.context.res.setStatusCode(201)
    }

    if (result instanceof TemplateResponse) {
      return this.context.res.html(result.html).send()
    } else if (isObject(result)) {
      return this.context.res.json(result as JsonObject).send()
    } else if (Array.isArray(result)) {
      return this.context.res.json(result).send()
    } else if (typeof result === 'string') {
      return this.context.res.text(result).send()
    } else {
      return this.context.error.internal(
        'Controller returned an unsupported value. Please return an object, an array or a string.',
      )
    }
  }

  protected async saveSessionStores(injectedSessions: Session[]): Promise<void> {
    for (const session of injectedSessions) {
      await session.data.save()
    }
  }
}
