import type { Except, JsonValue } from 'type-fest'
import { parse, serialize } from 'cookie'

import type { CookieOptions } from '../types/interfaces'
import type { IncomingHttpHeaders } from 'http'
import { config } from '../config/config'
import dayjs from 'dayjs'
import ms from 'ms'

export class Cookie {
  protected data = new Map<
    string,
    {
      options: CookieOptions
      value: JsonValue
    }
  >()
  private modifiedKeys = new Set<string>()

  constructor(headers: IncomingHttpHeaders) {
    const cookies = parse(headers.cookie ?? '')

    for (const [key, value] of Object.entries(cookies)) {
      try {
        const cookieValue = JSON.parse(value) as JsonValue

        this.data.set(key, {
          value: cookieValue,
          options: this.getCookieOptions(),
        })
      } catch (e) {
        // silent
      }
    }
  }
  public set(
    key: string,
    value: JsonValue,
    options?: Except<CookieOptions, 'enable' | 'strategy'>,
  ): void {
    this.modifiedKeys.add(key)
    this.data.set(key, {
      value,
      options: this.getCookieOptions(options),
    })
  }
  public get<T>(key: string): T {
    if (!this.data.has(key)) {
      return undefined
    }

    return this.data.get(key).value as T
  }
  public has(key: string): boolean {
    return this.data.has(key)
  }
  public serialize(): string {
    const cookies = []

    for (const [key, cookie] of this.data) {
      if (!this.modifiedKeys.has(key)) {
        continue
      }

      const options: CookieOptions & {
        expires?: Date
      } = cookie.options

      if (typeof cookie.options.expire === 'number') {
        options.expires = dayjs().add(cookie.options.expire, 'millisecond').toDate()
        delete cookie.options.expire
      } else if (typeof cookie.options.expire === 'string') {
        options.expires = dayjs().add(ms(cookie.options.expire), 'millisecond').toDate()
        delete cookie.options.expire
      }

      try {
        cookies.push(serialize(key, JSON.stringify(cookie.value), options))
      } catch (e) {
        // silent
      }
    }

    return cookies.length ? cookies.join('; ') : ''
  }
  private getCookieOptions(options?: Except<CookieOptions, 'enable' | 'strategy'>): CookieOptions {
    let cookieOptions = {}

    if (typeof options !== 'undefined') {
      if (config.web?.cookie?.strategy === 'merge') {
        cookieOptions = Object.assign({}, config.web?.cookie, options)
      } else {
        cookieOptions = options
      }
    } else if (config.web?.cookie) {
      cookieOptions = config.web?.cookie
    }

    return cookieOptions
  }
}
