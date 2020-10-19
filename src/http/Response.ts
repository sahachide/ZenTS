import type { Cookie } from './Cookie'
import type { JsonValue } from 'type-fest'
import { RESPONSE_BODY_TYPE } from '../types/enums'
import type { Request } from './Request'
import type { ResponseBody } from '../types/types'
import { ResponseHeader } from './ResponseHeader'
import type { ServerResponse } from 'http'
import type { Stream } from 'stream'
import { config } from '../config/config'
import { encodeUrl } from '../utils/encodeUrl'
import { escapeHtml } from '../utils/escapeHtml'
import { log } from '../log/logger'
import status from 'statuses'

export class Response {
  public header: ResponseHeader
  public isSend = false
  public isStatuscodeSetManual = false
  private bodyType: RESPONSE_BODY_TYPE
  private _body: ResponseBody

  constructor(public nodeRes: ServerResponse, private req: Request, private cookie: Cookie) {
    this.header = new ResponseHeader(nodeRes)
    this.nodeRes.statusCode = 200
  }

  public send(): void {
    if (this.isSend) {
      return
    }

    this.isSend = true

    if (config.web?.cookie?.enable) {
      this.setCookies()
    }
    if (this.bodyType === RESPONSE_BODY_TYPE.JSON) {
      this.sendJsonResponse()

      return
    } else if (
      this.bodyType === RESPONSE_BODY_TYPE.BUFFER ||
      this.bodyType === RESPONSE_BODY_TYPE.STREAM
    ) {
      this.sendBufferOrStreamResponse()

      return
    }

    this.sendDefaultResponse()
  }

  public json<T extends JsonValue>(data: T): this {
    this._body = data
    this.header.setContentType('application/json')
    this.bodyType = RESPONSE_BODY_TYPE.JSON

    return this
  }

  public html(html: string): this {
    this._body = html
    this.header.setContentType('html')
    this.bodyType = RESPONSE_BODY_TYPE.HTML

    return this
  }

  public text(text: string): this {
    this._body = text
    this.header.setContentType('text')
    this.bodyType = RESPONSE_BODY_TYPE.TEXT

    return this
  }

  public buffer(buffer: Buffer): this {
    this._body = buffer
    this.bodyType = RESPONSE_BODY_TYPE.BUFFER

    return this
  }

  public stream(stream: Stream): this {
    this._body = stream
    this.bodyType = RESPONSE_BODY_TYPE.STREAM

    return this
  }

  public redirect(url: string, statusCode: number = 302): void {
    const encodedUrl = encodeUrl(url)

    if (statusCode < 300 || statusCode > 308) {
      log.warn(
        `Failed to redirect to ${encodedUrl}. Status code has to be between 300 and 308. ${statusCode} given`,
      )

      return
    }

    const escapedUrl = escapeHtml(url)

    this.header.set('Location', encodedUrl)
    this.setStatusCode(statusCode)

    if (config.web?.redirectBodyType === 'html') {
      this.html(
        `<div>${this.getStatusMessage()} - Redirecting to <a href="${escapedUrl}">${escapedUrl}</a></div>`,
      )
    } else if (config.web?.redirectBodyType === 'text') {
      this.text(`${this.getStatusMessage()} - Redirecting to ${url}`)
    }

    return this.send()
  }

  public getStatusCode(): number {
    return this.nodeRes.statusCode
  }

  public setStatusCode(statusCode: number): this {
    if (this.header.isSend() || (statusCode <= 100 && statusCode >= 999)) {
      return this
    }

    this.nodeRes.statusCode = statusCode
    this.isStatuscodeSetManual = true

    if (this.req.httpVersionMajor < 2) {
      const message = this.getStatusMessageFromStatusCode(statusCode)

      this.setStatusMessage(message)
    }

    return this
  }

  public getStatusMessage(): string {
    if (!this.nodeRes.statusMessage.length) {
      return this.getStatusMessageFromStatusCode(this.getStatusCode())
    }

    return this.nodeRes.statusMessage
  }

  public setStatusMessage(message: string): this {
    if (this.header.isSend()) {
      return this
    }

    this.nodeRes.statusMessage = message

    return this
  }

  private setCookies(): void {
    const cookies = this.cookie.serialize()

    if (cookies && cookies.length) {
      this.header.set('Set-Cookie', cookies)
    }
  }

  private getStatusMessageFromStatusCode(statusCode: number): string {
    let message = status(statusCode)

    if (typeof message === 'number') {
      message = message.toString()
    }

    return message
  }

  private sendJsonResponse(): void {
    const body = JSON.stringify(this._body)

    this.setContentLengthByByteLength(body)
    this.nodeRes.end(body)
  }

  private sendBufferOrStreamResponse(): void {
    this.nodeRes.end(this._body)
  }

  private sendDefaultResponse(): void {
    if (!this._body) {
      return this.nodeRes.end()
    }

    this.setContentLengthByByteLength(this._body as string)
    this.nodeRes.end(this._body)
  }

  private setContentLengthByByteLength(body: string): void {
    if (!this.header.isSend()) {
      const length = Buffer.byteLength(body)

      this.header.set('Content-Length', length)
    }
  }
}
