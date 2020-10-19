import type { SecurityProviderOption, SecurityProviderOptionEntities } from '../types/interfaces'

import type { Class } from 'type-fest'
import SecurePassword from 'secure-password'
import { fs } from '../filesystem/FS'
import { join } from 'path'
import ms from 'ms'

export class SecurityProviderOptions {
  constructor(
    public options: SecurityProviderOption,
    protected entities: SecurityProviderOptionEntities,
  ) {}

  get name(): string {
    return this.options.name ?? 'default'
  }

  get algorithm(): 'bcrypt' | 'argon2id' {
    return this.options.algorithm ?? 'argon2id'
  }

  get userEntity(): Class {
    return this.entities.user
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

  get storeType(): 'redis' | 'database' | 'file' {
    return this.options.store?.type
  }

  get responseType(): 'json' | 'redirect' {
    return this.options.responseType ?? 'redirect'
  }

  get storePrefix(): string {
    const defaultPrefix = 'zen_'

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

  get dbStoreEntity(): Class {
    return this.entities.dbStore ?? null
  }

  get fileStoreFolder(): string {
    const defaultValue = join(fs.appDir(), 'session')

    return this.options.store?.type === 'file'
      ? this.options.store?.folder ?? defaultValue
      : defaultValue
  }
}
