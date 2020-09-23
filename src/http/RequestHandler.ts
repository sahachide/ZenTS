import type {
  Context,
  ControllerMethodReturnType,
  ControllerRoute,
  GenericControllerInstance,
  IncomingParams,
  ParsedBody,
} from '../types'
import type { IncomingMessage, ServerResponse } from 'http'

import { BodyParser } from './BodyParser'
import { Cookie } from './Cookie'
import { Injector } from '../dependencies/Injector'
import type { JsonObject } from 'type-fest'
import type { Registry } from '../core/Registry'
import { Request } from './Request'
import { Response } from './Response'
import { ResponseError } from './ResponseError'
import { TemplateResponse } from '../template/TemplateResponse'
import { config } from '../config/config'
import { isObject } from '../utils/isObject'

export class RequestHandler {
  protected controllerInstance: GenericControllerInstance
  protected controllerMethod: string
  protected nodeReq: IncomingMessage
  protected nodeRes: ServerResponse
  protected params: IncomingParams
  protected injector: Injector
  private didRun: boolean = false
  constructor(
    registry: Registry,
    controllerKey: string,
    { controllerMethod }: ControllerRoute,
    req: IncomingMessage,
    res: ServerResponse,
    params: IncomingParams,
  ) {
    this.nodeReq = req
    this.nodeRes = res
    this.params = params
    this.controllerInstance = registry.factories.controller.build<GenericControllerInstance>(
      controllerKey,
    )
    this.controllerMethod = controllerMethod
    this.injector = registry.factories.controller.getInjector()
  }
  public async run(): Promise<void> {
    if (this.didRun) {
      return
    } else if (typeof this.controllerInstance[this.controllerMethod] !== 'function') {
      throw new Error(`Fatal Error: ${this.controllerMethod} isn't a function.`)
    }

    this.didRun = true
    const context = await this.buildContext()
    const injectedParameters = this.injector.injectFunctionParameters(
      this.controllerInstance,
      this.controllerMethod,
    )
    const result = await this.controllerInstance[this.controllerMethod](
      context,
      ...injectedParameters,
    )

    if (!context.res.isSend) {
      this.handleResult(context, result)
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
  protected async buildContext(): Promise<Context> {
    const method = this.nodeReq.method.toLowerCase()
    let body: ParsedBody = null

    if (method === 'post' || method === 'put') {
      const bodyParser = new BodyParser()

      body = await bodyParser.parse(this.nodeReq)
    }

    const cookie = config.web?.cookie?.enable ? new Cookie(this.nodeReq.headers) : null
    const req = new Request(this.nodeReq, body, this.params)
    const res = new Response(this.nodeRes, req, cookie)
    const error = new ResponseError(res)

    return {
      req,
      res,
      error,
      cookie,
      body: req.body,
      params: req.params,
      query: req.query,
    }
  }
}
