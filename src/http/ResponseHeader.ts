import type { HeaderValue, HeaderValues } from '../types'
import type { OutgoingHttpHeaders, ServerResponse } from 'http'

import { getContentType } from '../utils/getContentType'

export class ResponseHeader {
  constructor(private res: ServerResponse) {}

  public all(): OutgoingHttpHeaders {
    return this.res.getHeaders()
  }
  public get(key: string): HeaderValue {
    return this.res.getHeader(key)
  }
  public has(key: string): boolean {
    if (this.isSend()) {
      return false
    }

    return this.res.hasHeader(key)
  }
  public set(key: string, value: HeaderValue): void {
    if (this.isSend()) {
      return
    }

    this.res.setHeader(key, value.toString())
  }
  public multiple(headers: HeaderValues[]): void {
    if (this.isSend()) {
      return
    }

    for (const header of headers) {
      this.set(header.key, header.value)
    }
  }
  public setContentType(filenameOrExt: string): boolean {
    const type = getContentType(filenameOrExt)

    if (!type) {
      return false
    }

    this.set('Content-Type', filenameOrExt)

    return true
  }
  public getContentType(): string | null {
    const contentType = this.get('Content-Type')

    if (typeof contentType !== 'string') {
      return null
    }

    return contentType
  }
  public remove(key: string): void {
    if (this.isSend()) {
      return
    }

    this.res.removeHeader(key)
  }
  public flush(): void {
    this.res.flushHeaders()
  }
  public keys(): string[] {
    return this.res.getHeaderNames()
  }
  public isSend(): boolean {
    return this.res.headersSent
  }
}
