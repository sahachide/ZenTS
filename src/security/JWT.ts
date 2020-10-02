import { sign, verify } from 'jsonwebtoken'

import type { JWTVerifyResponse } from '../types/interfaces'
import type { JsonObject } from 'type-fest'
import { config } from '../config/config'

export abstract class JWT {
  public static async sign(payload: string | Buffer | JsonObject): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(payload, config.security.secretKey, (err, jwt: string) => {
        if (err) {
          return reject(err)
        }

        return resolve(jwt)
      })
    })
  }

  public static async verify(token: string): Promise<JWTVerifyResponse> {
    return new Promise((resolve) => {
      verify(token, config.security.secretKey, (err, decoded: string | Buffer | JsonObject) => {
        if (err) {
          return resolve({
            isValid: false,
          })
        }

        return resolve({
          isValid: true,
          decoded,
        })
      })
    })
  }
}
