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
    const injectedParameters = await this.injector.injectFunctionParameters(
      this.controllerInstance,
      this.controllerMethod,
      this.context,
      this.loadedUser,
    )
    const result = await this.controllerInstance[this.controllerMethod](
      this.context,
      ...injectedParameters,
    )

    if (!this.context.res.isSend) {
      this.handleResult(this.context, result)
    }
  }

  protected handleResult(context: Context, result: ControllerMethodReturnType): void {
    if (!result) {
      return
    }

    if (context.req.httpMethod === 'post' && !context.res.isStatuscodeSetManual) {
      context.res.setStatusCode(201)
    }

    if (result instanceof TemplateResponse) {
      return context.res.html(result.html).send()
    } else if (isObject(result)) {
      return context.res.json(result as JsonObject).send()
    } else if (Array.isArray(result)) {
      return context.res.json(result).send()
    } else if (typeof result === 'string') {
      return context.res.text(result).send()
    } else {
      return context.error.internal(
        'Controller returned an unsupported value. Please return an object, an array or a string.',
      )
    }
  }
}
