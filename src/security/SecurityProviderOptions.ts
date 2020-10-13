import type { Class } from 'type-fest'
import SecurePassword from 'secure-password'
import type { SecurityProviderOption } from '../types/interfaces'
import ms from 'ms'

export class SecurityProviderOptions {
  constructor(public options: SecurityProviderOption, public entity: Class) {}

  get name(): string {
    return this.options.name ?? 'default'
  }

  get algorithm(): 'bcrypt' | 'argon2id' {
    return this.options.algorithm ?? 'argon2id'
  }

  get expireInMS(): number {
    const value = this.options.expire

    if (typeof value === 'undefined') {
      return -1
    } else if (typeof value === 'number') {
      return value
    }

    return ms(value)
  }

  get loginUrl(): string {
    return this.options.url?.login ?? '/login'
  }

  get logoutUrl(): string {
    return this.options.url?.logout ?? '/logout'
  }

  get loginRedirectUrl(): string {
    return this.options.redirect?.login ?? '/'
  }

  get logoutRedirectUrl(): string {
    return this.options.redirect?.logout ?? '/'
  }

  get failedRedirectUrl(): string {
    return this.options.redirect?.failed ?? '/'
  }

  get forbiddenRedirectUrl(): string {
    return this.options.redirect?.forbidden ?? '/'
  }

  get memLimit(): number {
    return this.options.argon?.memLimit ?? SecurePassword.MEMLIMIT_DEFAULT
  }

  get opsLimit(): number {
    return this.options.argon?.opsLimit ?? SecurePassword.OPSLIMIT_DEFAULT
  }

  get saltRounds(): number {
    return this.options.bcrypt?.saltRounds ?? 12
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

  get storeType(): string | null {
    return this.options.store?.type ?? null
  }

  get responseType(): 'json' | 'redirect' {
    return this.options.responseType ?? 'json'
  }

  get redisStorePrefix(): string {
    const defaultPrefix = 'zen:'

    return this.options.store?.type === 'redis'
      ? this.options.store?.prefix ?? defaultPrefix
      : defaultPrefix
  }

  get redisKeepTTL(): boolean {
    const defaultValue = false

    return this.options.store?.type === 'redis'
      ? this.options.store?.keepTTL ?? defaultValue
      : defaultValue
  }
}
