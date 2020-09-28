import type { DefaultSecurityStrategyAlgorithm, SecurityStrategyOptions } from '../types/types'

import type { Class } from 'type-fest'
import SecurePassword from 'secure-password'

export class SecurityProvider {
  constructor(protected options: SecurityStrategyOptions, public entity: Class) {}

  get name(): string {
    return this.options.name ?? 'default'
  }

  get algorithm(): DefaultSecurityStrategyAlgorithm {
    return this.options.algorithm ?? 'argon2id'
  }

  get loginRoute(): string {
    return this.options.loginRoute ?? '/login'
  }

  get logoutRoute(): string {
    return this.options.logoutRoute ?? '/logout'
  }

  get memLimit(): number {
    return this.options.memLimit ?? SecurePassword.MEMLIMIT_DEFAULT
  }

  get opsLimit(): number {
    return this.options.opsLimit ?? SecurePassword.OPSLIMIT_DEFAULT
  }

  get saltRounds(): number {
    return this.options.saltRounds ?? 12
  }
}
