import { decode, sign, verify } from 'jsonwebtoken'

import type { JWTOptions } from '../types/interfaces'
import { config } from '../config/config'
import { isObject } from '../utils/isObject'

export abstract class JWT {
  public static async sign(payload: { [key: string]: any }): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = Object.assign({}, this.getOptions(), { noTimestamp: true })

      sign(payload, config.security.secretKey, options, (err, jwt: string) => {
        if (err) {
          return reject(err)
        }

        return resolve(jwt)
      })
    })
  }

  public static async verify(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      const options = Object.assign({}, this.getOptions(), {
        ignoreExpiration: true,
        ignoreNotBefore: true,
      })

      verify(token, config.security.secretKey, options, (err) => {
        if (err) {
          return resolve(false)
        }

        return resolve(true)
      })
    })
  }

  public static decode<T>(token: string): T {
    return decode(token, {
      json: true,
    }) as T
  }

  protected static getOptions(): JWTOptions {
    const options: JWTOptions = {}

    if (isObject(config.security?.token)) {
      const stringKeys: ('issuer' | 'algorithm' | 'subject' | 'jwtid' | 'keyid')[] = [
        'issuer',
        'algorithm',
        'subject',
        'jwtid',
        'keyid',
      ]

      for (const key of stringKeys) {
        if (typeof config.security?.token[key] === 'string') {
          options[key] = config.security?.token[key]
        }
      }

      if (
        typeof config.security?.token?.audience === 'string' ||
        Array.isArray(config.security?.token?.audience)
      ) {
        options.audience = config.security.token.audience
      }
    }

    return options
  }
}
