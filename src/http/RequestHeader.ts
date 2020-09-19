import type { RequestHeaders, RequestHeadersValue } from '../types/types'

import type { IncomingMessage } from 'http'

export class RequestHeader {
  protected data: RequestHeaders
  constructor(req: IncomingMessage) {
    this.data = new Map() as RequestHeaders

    for (const [key, value] of Object.entries(req.headers)) {
      this.data.set(key, value)
    }
  }

  public all(): IterableIterator<[string, RequestHeadersValue]> {
    return this.data.entries()
  }
  public get(key: string): RequestHeadersValue {
    return this.data.get(key)
  }
  public has(key: string): boolean {
    return this.data.has(key)
  }
  public remove(key: string): void {
    this.data.delete(key)
  }
  public set(key: string, value: RequestHeadersValue): void {
    this.data.set(key, value)
  }
  public getHost(): string | undefined {
    return this.data.get('host') as string | undefined
  }
  public getAccept(): string | undefined {
    return this.data.get('accept') as string | undefined
  }
}
