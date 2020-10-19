import type { Entities, SecurityProviders } from '../types/types'
import type {
  SecurityProviderOption,
  SecurityProviderOptionEntities,
  SecurityStrategy,
} from '../types/interfaces'

import { Class } from 'type-fest'
import { CookieSecurityStrategy } from './strategies/CookieSecurityStrategy'
import type { DatabaseContainer } from '../database/DatabaseContainer'
import { HeaderSecurityStrategy } from './strategies/HeaderSecurityStrategy'
import { HybridSecurityStrategy } from './strategies/HybridSecurityStrategy'
import { SecurityProvider } from './SecurityProvider'
import { SecurityProviderOptions } from './SecurityProviderOptions'
import { SecurityResponse } from './SecurityResponse'
import { SessionStoreAdapterFactory } from './SessionStoreAdapterFactory'
import { config } from '../config/config'
import { isObject } from '../utils/isObject'
import { log } from '../log/logger'

export class SecurityProviderLoader {
  public load(entities: Entities, databaseContainer: DatabaseContainer): SecurityProviders {
    const adapterFactory = new SessionStoreAdapterFactory(databaseContainer)
    const providers = new Map() as SecurityProviders

    if (!isObject(config.security) || !config.security.enable) {
      return providers
    }

    for (const providerConfig of config.security.providers) {
      const options = new SecurityProviderOptions(
        providerConfig,
        this.getEntities(entities, providerConfig),
      )

      if (providers.has(options.name)) {
        log.warn(`Security provider "${options.name}" is already registered!`)

        continue
      }

      const response = new SecurityResponse(options)
      const adapter = adapterFactory.build(options)
      const provider = new SecurityProvider(
        options,
        response,
        adapter,
        this.getSecurityStrategy(),
        databaseContainer,
      )

      providers.set(options.name, provider)
    }

    return providers
  }

  protected getEntities(
    entities: Entities,
    providerConfig: SecurityProviderOption,
  ): SecurityProviderOptionEntities {
    const user =
      typeof providerConfig.entity === 'string'
        ? entities.get(providerConfig.entity.toLowerCase())
        : null

    let dbStore: Class

    if (providerConfig.store?.type === 'database') {
      dbStore = entities.get(providerConfig.store?.entity.toLowerCase())
    }

    return {
      user,
      dbStore,
    }
  }

  protected getSecurityStrategy(): SecurityStrategy {
    let securityStrategy: SecurityStrategy

    if (config.security?.strategy === 'header') {
      securityStrategy = new HeaderSecurityStrategy()
    } else if (config.security?.strategy === 'hybrid') {
      securityStrategy = new HybridSecurityStrategy()
    } else {
      securityStrategy = new CookieSecurityStrategy()
    }

    return securityStrategy
  }
}
