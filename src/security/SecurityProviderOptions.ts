import type { Class } from 'type-fest'
import SecurePassword from 'secure-password'
import type { SecurityProviderOption } from '../types/interfaces'

export class SecurityProviderOptions {
  constructor(public options: SecurityProviderOption, public entity: Class) {}

  get name(): string {
    return this.options.name ?? 'default'
  }

  get algorithm(): 'bcrypt' | 'argon2id' {
    return this.options.algorithm ?? 'argon2id'
  }

  get loginRoute(): string {
    return this.options.routes?.login ?? '/login'
  }

  get logoutRoute(): string {
    return this.options.routes?.logout ?? '/logout'
  }

  get memLimit(): number {
    return this.options.argon?.memLimit ?? SecurePassword.MEMLIMIT_DEFAULT
  }

  get opsLimit(): number {
    return this.options.argon?.opsLimit ?? SecurePassword.OPSLIMIT_DEFAULT
  }

  get saltRounds(): number {
    return this.options.bcrypt?.saltRounds ?? 18
  }

  get identifierColumn(): string {
    return this.options.table?.identifierColumn ?? 'id'
  }

  get passwordColumn(): string {
    return this.options.table?.passwordColumn ?? 'password'
  }

  get usernameField(): string {
    return this.options.fields?.username ?? 'username'
  }

  get passwordField(): string {
    return this.options.fields?.password ?? 'password'
  }
}
