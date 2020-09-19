import type { IncomingParams, ParsedBody, QueryString } from '../types/interfaces'
import { parse, stringify } from 'qs'

import type { IncomingMessage } from 'http'
import type { JsonValue } from 'type-fest'
import { RequestHeader } from './RequestHeader'
import type { Socket } from 'net'
import { config } from '../config/config'
import parseurl from 'parseurl'

export class Request {
  public header: RequestHeader
  protected _body: JsonValue
  protected _query: QueryString
  protected _params: IncomingParams
  protected _pathname: string = null
  constructor(public nodeReq: IncomingMessage, parsedBody: ParsedBody, params: IncomingParams) {
    this.header = new RequestHeader(nodeReq)
    this.query = parse(parseurl(nodeReq).query as string, config.web?.querystring)
    this.body = parsedBody ? parsedBody.fields : {}
    this.pathname = parseurl(this.nodeReq).pathname
    this._params = params
  }
  get body(): JsonValue {
    return this._body
  }
  set body(body: JsonValue) {
    this._body = body
  }
  get params(): IncomingParams {
    return this._params
  }
  set params(params: IncomingParams) {
    this._params = params
  }
  get query(): QueryString {
    return this._query
  }
  set query(query: QueryString) {
    this._query = query
  }
  get querystring(): string {
    return stringify(this._query)
  }
  set querystring(querystring: string) {
    this.query = parse(querystring, config.web?.querystring)
  }
  get search(): string {
    if (!this.querystring.length) {
      return ''
    }

    return `?${this.querystring}`
  }
  get url(): string {
    return this.nodeReq.url
  }
  set url(url: string) {
    this.nodeReq.url = url
  }
  get httpMethod(): string {
    return this.nodeReq.method.toLowerCase()
  }
  set httpMethod(httpMethod: string) {
    this.nodeReq.method = httpMethod
  }
  get pathname(): string {
    return this._pathname
  }
  set pathname(pathname: string) {
    this._pathname = pathname
  }
  get httpVersion(): string {
    return this.nodeReq.httpVersion.toLowerCase()
  }
  get httpVersionMajor(): number {
    return this.nodeReq.httpVersionMajor
  }
  get httpVersionMinor(): number {
    return this.nodeReq.httpVersionMinor
  }
  get socket(): Socket {
    return this.nodeReq.socket
  }
}
