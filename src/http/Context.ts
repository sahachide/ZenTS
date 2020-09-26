import type { IncomingMessage, ServerResponse } from 'http'
import type { IncomingParams, ParsedBody, QueryString } from '../types/interfaces'

import { BodyParser } from './BodyParser'
import { Cookie } from './Cookie'
import type { JsonObject } from 'type-fest'
import { Request } from './Request'
import { Response } from './Response'
import { ResponseError } from './ResponseError'
import { config } from '../config/config'

export class Context {
  private container!: {
    body: ParsedBody
    cookie: Cookie
    req: Request
    res: Response
    error: ResponseError
  }
  private isBuild: boolean = false

  public async build(
    request: IncomingMessage,
    response: ServerResponse,
    params: IncomingParams,
  ): Promise<void> {
    if (this.isBuild) {
      return
    }

    this.isBuild = true

    const method = request.method.toLowerCase()
    let body: ParsedBody = null

    if (method === 'post' || method === 'put') {
      const bodyParser = new BodyParser()

      body = await bodyParser.parse(request)
    }

    const cookie = config.web?.cookie?.enable ? new Cookie(request.headers) : null
    const req = new Request(request, body, params)
    const res = new Response(response, req, cookie)
    const error = new ResponseError(res)

    this.container = {
      body,
      cookie,
      req,
      res,
      error,
    }
  }

  get req(): Request {
    return this.container.req
  }

  get request(): Request {
    return this.container.req
  }

  get res(): Response {
    return this.container.res
  }

  get response(): Response {
    return this.container.res
  }

  get body(): JsonObject {
    return this.container.body?.fields ?? null
  }

  get query(): QueryString {
    return this.container.req.query
  }

  get params(): IncomingParams {
    return this.container.req.params
  }

  get cookie(): Cookie | null {
    return this.container.cookie
  }

  get error(): ResponseError {
    return this.container.error
  }
}
