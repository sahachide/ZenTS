import { decode, sign, verify } from 'jsonwebtoken'

import { config } from '../config/config'

export abstract class JWT {
  public static async sign(payload: { [key: string]: any }): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(payload, config.security.secretKey, (err, jwt: string) => {
        if (err) {
          return reject(err)
        }

        return resolve(jwt)
      })
    })
  }

  public static async verify(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      verify(token, config.security.secretKey, (err) => {
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
}
