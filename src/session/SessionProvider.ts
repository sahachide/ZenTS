import type { SessionProviderOption, SessionProviderOptionType } from './../types/'

import type { Class } from 'type-fest'

export class SessionProvider {
  constructor(public entity: Class, protected option: SessionProviderOption) {}

  get name(): string {
    return this.option.name ?? 'default'
  }

  get usernameField(): string {
    return this.option.usernameField ?? 'username'
  }

  get passwordField(): string {
    return this.option.passwordField ?? 'password'
  }

  get loginRoute(): string {
    return this.option.loginRoute ?? '/login'
  }

  get logoutRoute(): string {
    return this.option.logoutRoute ?? '/logout'
  }

  get type(): SessionProviderOptionType {
    return this.option.type ?? 'json'
  }
}
