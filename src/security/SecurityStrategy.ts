import type { Connection } from 'typeorm'
import SecurePassword from 'secure-password'
import type { SecurityProvider } from './SecurityProvider'
import type { SecurityRequestContext } from '../types/types'
import bcrypt from 'bcrypt'

export class SecurityStrategy {
  private argon2idGenerator: SecurePassword

  constructor(public provider: SecurityProvider, protected connection: Connection) {
    this.argon2idGenerator =
      provider.algorithm === 'argon2id'
        ? new SecurePassword({
            memlimit: provider.memLimit,
            opslimit: provider.opsLimit,
          })
        : null
  }

  public async login(context: SecurityRequestContext): Promise<void> {
    const username = context.body.username
    const password = context.body.password

    if (
      typeof username !== 'string' ||
      !username.length ||
      typeof password !== 'string' ||
      !password.length
    ) {
      return this.forbiddenResponse(context)
    }

    const repository = this.connection.getRepository<{ [key: string]: string }>(
      this.provider.entity,
    )
    const user = await repository.findOne({
      username,
    })

    if (!user || typeof user.password !== 'string') {
      return this.forbiddenResponse(context)
    }

    const passwordHash = user.password

    if (!(await bcrypt.compare(password, passwordHash))) {
      return this.forbiddenResponse(context)
    }

    return context.res
      .json({
        success: true,
      })
      .send()
  }

  public async generatePasswordHash(plainTextPassword: string): Promise<string> {
    let hash: string

    if (this.provider.algorithm === 'argon2id') {
      const passwordBuffer = Buffer.from(plainTextPassword)

      hash = (await this.argon2idGenerator.hash(passwordBuffer)).toString()
    } else if (this.provider.algorithm === 'bcrypt') {
      hash = await bcrypt.hash(plainTextPassword, this.provider.saltRounds)
    }

    return hash
  }

  protected forbiddenResponse(context: SecurityRequestContext): void {
    return context.error.forbidden('Unauthorized access', {
      detail: 'Username or password not found',
    })
  }
}
