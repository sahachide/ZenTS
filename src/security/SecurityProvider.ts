import type {
  SecurityProviderAuthorizeResponse,
  SecurityStrategy,
  SessionStoreAdapter,
  TokenData,
} from '../types/interfaces'

import type { Connection } from 'typeorm'
import type { Context } from '../http/Context'
import { DB_TYPE } from '../types/enums'
import type { DatabaseContainer } from '../database/DatabaseContainer'
import { JWT } from './JWT'
import SecurePassword from 'secure-password'
import type { SecurityProviderOptions } from './SecurityProviderOptions'
import type { SecurityRequestContext } from '../types/types'
import type { SecurityResponse } from './SecurityResponse'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export class SecurityProvider {
  protected connection: Connection
  private argon2idGenerator: SecurePassword

  constructor(
    public options: SecurityProviderOptions,
    protected response: SecurityResponse,
    protected adapter: SessionStoreAdapter,
    protected strategy: SecurityStrategy,
    databaseContainer: DatabaseContainer,
  ) {
    this.connection = databaseContainer.get(DB_TYPE.ORM)
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
      return this.response.loginFailed(context)
    }

    const repository = this.connection.getRepository<{ [key: string]: string }>(
      this.options.userEntity,
    )
    const user = await repository.findOne({
      username,
    })

    if (
      !user ||
      typeof user[this.options.passwordColumn] !== 'string' ||
      typeof user[this.options.identifierColumn] === 'undefined'
    ) {
      return this.response.loginFailed(context)
    }

    const passwordHash = user[this.options.passwordColumn]

    if (!(await bcrypt.compare(password, passwordHash))) {
      return this.response.loginFailed(context)
    }

    const token = await this.generateToken(context, user[this.options.identifierColumn])

    await this.adapter.create(token.sessionId)
    this.strategy.setToken(context, token.token)

    return this.response.loginSuccess(context, token.token)
  }

  public async logout(context: SecurityRequestContext): Promise<void> {
    if (!this.strategy.hasToken(context)) {
      return this.response.logoutFailed(context)
    }

    const token = this.strategy.getToken(context)
    if (token === false) {
      return this.response.forbidden(context)
    }

    const parsedToken = await this.parseToken(token)
    if (parsedToken === false) {
      return this.response.forbidden(context)
    }

    await this.adapter.remove(parsedToken.sessionId)

    return this.response.logoutSuccess(context)
  }

  public async authorize(context: Context): Promise<SecurityProviderAuthorizeResponse> {
    const isNotAuth = {
      isAuth: false,
    }

    if (!this.strategy.hasToken(context)) {
      return isNotAuth
    }

    const token = this.strategy.getToken(context)
    if (token === false) {
      return isNotAuth
    }

    const parsedToken = await this.parseToken(token)

    if (parsedToken === false || !(await this.adapter.has(parsedToken.sessionId))) {
      return isNotAuth
    }

    const repository = this.connection.getRepository<{ [key: string]: string }>(
      this.options.userEntity,
    )
    const user = await repository.findOne({
      [this.options.identifierColumn]: parsedToken.userId,
    })

    if (!user) {
      return isNotAuth
    }

    return {
      isAuth: true,
      sessionId: parsedToken.sessionId,
      user,
    }
  }

  public async forbidden(context: Context): Promise<void> {
    return new Promise((resolve) => {
      this.response.forbidden(context)
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

    if (this.strategy.hasToken(context)) {
      const currentToken = this.strategy.getToken(context) as string

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

  protected async parseToken(token: string): Promise<TokenData | false> {
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
}
