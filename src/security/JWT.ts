import type { JsonObject } from 'type-fest'
import { config } from '../config/config'
import { sign } from 'jsonwebtoken'

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
}
