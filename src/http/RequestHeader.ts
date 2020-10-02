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
  public get<T extends RequestHeadersValue>(key: string): T {
    return this.data.get(key.toLowerCase()) as T
  }
  public has(key: string): boolean {
    return this.data.has(key.toLowerCase())
  }
  public remove(key: string): void {
    this.data.delete(key.toLowerCase())
  }
  public set(key: string, value: RequestHeadersValue): void {
    this.data.set(key.toLowerCase(), value)
  }
  public getHost(): string | undefined {
    return this.data.get('host') as string | undefined
  }
  public getAccept(): string | undefined {
    return this.data.get('accept') as string | undefined
  }
}
