import type { SecurityProviderAuthorizeResponse, TokenData } from '../types/interfaces'

import type { Connection } from 'typeorm'
import type { Context } from '../http/Context'
import { JWT } from './JWT'
import type { RedisSessionStoreAdapter } from './stores/RedisSessionStoreAdapter'
import SecurePassword from 'secure-password'
import type { SecurityProviderOptions } from './SecurityProviderOptions'
import type { SecurityRequestContext } from '../types/types'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export class SecurityProvider {
  private argon2idGenerator: SecurePassword

  constructor(
    public options: SecurityProviderOptions,
    protected adapter: RedisSessionStoreAdapter,
    protected connection: Connection,
  ) {
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

    await this.adapter.create(token.sessionId)

    return context.res
      .json({
        token: token.token,
      })
      .send()
  }

  public async logout(context: SecurityRequestContext): Promise<void> {
    if (!context.request.header.has('authorization')) {
      return context.error.badRequest('Authorization header missing')
    }

    const token = await this.getToken(context.request.header.get<string>('authorization'))

    if (token === false) {
      return context.error.forbidden('Invalid token')
    }

    await this.adapter.remove(token.sessionId)

    return context.res
      .json({
        success: true,
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

    const token = await this.getToken(context.request.header.get<string>('authorization'))

    if (token === false) {
      return isNotAuth
    }

    if (!(await this.adapter.has(token.sessionId))) {
      return isNotAuth
    }

    const repository = this.connection.getRepository<{ [key: string]: string }>(this.options.entity)
    const user = await repository.findOne({
      [this.options.identifierColumn]: token.userId,
    })

    if (!user) {
      return isNotAuth
    }

    return {
      isAuth: true,
      sessionId: token.sessionId,
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

  protected async generateToken(
    context: SecurityRequestContext,
    userId: string,
  ): Promise<{
    token: string
    sessionId: string
  }> {
    const sessionId = this.generateSessionId()
    let providers: TokenData[] = [
      {
        provider: this.options.name,
        sessionId,
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

    return {
      token: await JWT.sign({
        providers,
      }),
      sessionId,
    }
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

  protected async getToken(headerToken: string | undefined): Promise<TokenData | false> {
    if (typeof headerToken === 'undefined') {
      return false
    }

    const splitted = headerToken.trim().split(' ')

    if (splitted.length < 2 || splitted[0].toLowerCase() !== 'bearer') {
      return false
    }

    const token = splitted[1]

    if (!(await JWT.verify(token))) {
      return false
    }

    const decoded = JWT.decode<{
      providers: TokenData[]
    }>(token)

    if (!Array.isArray(decoded.providers)) {
      return false
    }

    const provider: TokenData[] | TokenData = decoded.providers.filter(
      (data) => data.provider === this.options.name,
    )

    if (!provider.length) {
      return false
    }

    return provider[0]
  }

  private forbiddenResponse(context: SecurityRequestContext): void {
    return context.error.forbidden('Unauthorized access', {
      detail: 'Username or password not found',
    })
  }
}
