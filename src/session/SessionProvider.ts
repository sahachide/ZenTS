import type { SessionProviderOption, SessionProviderOptionType } from './../types/'

export class SessionProvider {
  constructor(protected option: SessionProviderOption) {}

  get name(): string {
    return this.option.name ?? 'default'
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
