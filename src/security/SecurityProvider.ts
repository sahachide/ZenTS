import type { SecurityProviderAuthorizeResponse, TokenData } from '../types/interfaces'

import type { Connection } from 'typeorm'
import type { Context } from '../http/Context'
import { JWT } from './JWT'
import SecurePassword from 'secure-password'
import type { SecurityProviderOptions } from './SecurityProviderOptions'
import type { SecurityRequestContext } from '../types/types'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export class SecurityProvider {
  private argon2idGenerator: SecurePassword

  constructor(public options: SecurityProviderOptions, protected connection: Connection) {
    this.argon2idGenerator =
      this.options.algorithm === 'argon2id'
        ? new SecurePassword({
            memlimit: options.memLimit,
            opslimit: options.opsLimit,
          })
        : null
  }

  public async login(context: SecurityRequestContext): Promise<void> {
    const username = context.body[this.options.usernameField]
    const password = context.body[this.options.passwordField]

    if (
      typeof username !== 'string' ||
      !username.length ||
      typeof password !== 'string' ||
      !password.length
    ) {
      return this.forbiddenResponse(context)
    }

    const repository = this.connection.getRepository<{ [key: string]: string }>(this.options.entity)
    const user = await repository.findOne({
      username,
    })

    if (
      !user ||
      typeof user[this.options.passwordColumn] !== 'string' ||
      typeof user[this.options.identifierColumn] === 'undefined'
    ) {
      return this.forbiddenResponse(context)
    }

    const passwordHash = user[this.options.passwordColumn]

    if (!(await bcrypt.compare(password, passwordHash))) {
      return this.forbiddenResponse(context)
    }

    const token = await this.generateToken(context, user[this.options.identifierColumn])

    return context.res
      .json({
        token,
      })
      .send()
  }

  public async authorize(context: Context): Promise<SecurityProviderAuthorizeResponse> {
    const isNotAuth = {
      isAuth: false,
    }

    if (!context.request.header.has('authorization')) {
      return isNotAuth
    }

    const headerToken = context.request.header.get<string>('authorization')
    const splitted = headerToken.trim().split(' ')

    if (splitted.length < 2 || splitted[0].toLowerCase() !== 'bearer') {
      return isNotAuth
    }

    const token = splitted[1]

    if (!(await JWT.verify(token))) {
      return isNotAuth
    }

    const decoded = JWT.decode<{
      providers: TokenData[]
    }>(token)

    if (!Array.isArray(decoded.providers)) {
      return isNotAuth
    }

    let provider: TokenData[] | TokenData = decoded.providers.filter(
      (data) => data.provider === this.options.name,
    )

    if (!provider.length) {
      return isNotAuth
    }

    provider = provider[0]

    const repository = this.connection.getRepository<{ [key: string]: string }>(this.options.entity)
    const user = await repository.findOne({
      [this.options.identifierColumn]: provider.userId,
    })

    if (!user) {
      return isNotAuth
    }

    return {
      isAuth: true,
      sessionId: provider.sessionId,
      user,
    }
  }

  public async forbidden(context: Context): Promise<void> {
    return new Promise((resolve) => {
      context.error.forbidden()
      resolve()
    })
  }

  public async generatePasswordHash(plainTextPassword: string): Promise<string> {
    let hash: string

    if (this.options.algorithm === 'argon2id') {
      const passwordBuffer = Buffer.from(plainTextPassword)

      hash = (await this.argon2idGenerator.hash(passwordBuffer)).toString()
    } else if (this.options.algorithm === 'bcrypt') {
      hash = await bcrypt.hash(plainTextPassword, this.options.saltRounds)
    }

    return hash
  }

  public generateSessionId(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  protected async generateToken(context: SecurityRequestContext, userId: string): Promise<string> {
    let providers: TokenData[] = [
      {
        provider: this.options.name,
        sessionId: this.generateSessionId(),
        userId,
      },
    ]

    if (context.request.header.has('authorization')) {
      const currentToken = context.request.header.get<string>('authorization')

      if (await this.verifyToken(currentToken)) {
        const currentData = JWT.decode<{
          providers: TokenData[]
        }>(currentToken)

        if (currentData && Array.isArray(currentData.providers)) {
          providers = [...providers, ...currentData.providers]
        }
      }
    }

    return await JWT.sign({
      providers,
    })
  }

  protected async verifyToken(token: string): Promise<boolean> {
    if (typeof token !== 'string' || !token.length) {
      return false
    }

    const splitted = token.trim().split(' ')

    if (splitted.length < 2 || splitted[0].toLowerCase() !== 'bearer') {
      return false
    }

    return await JWT.verify(splitted[1])
  }

  protected forbiddenResponse(context: SecurityRequestContext): void {
    return context.error.forbidden('Unauthorized access', {
      detail: 'Username or password not found',
    })
  }
}
