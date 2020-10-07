import type { Entities, SecurityProviders } from '../types/types'

import type { Connection } from 'typeorm'
import type { Redis } from 'ioredis'
import { RedisSessionStoreAdapter } from './stores/RedisSessionStoreAdapter'
import { SecurityProvider } from './SecurityProvider'
import { SecurityProviderOptions } from './SecurityProviderOptions'
import { config } from '../config/config'
import { isObject } from '../utils/isObject'
import { log } from '../log/logger'

export class SecurityProviderLoader {
  public load(entities: Entities, connection: Connection, redisClient: Redis): SecurityProviders {
    const providers = new Map() as SecurityProviders

    if (!isObject(config.security) || !config.security.enable) {
      return providers
    }

    for (const providerConfig of config.security.providers) {
      const entity =
        typeof providerConfig.entity === 'string'
          ? entities.get(providerConfig.entity.toLowerCase())
          : null

      const options = new SecurityProviderOptions(providerConfig, entity)

      if (providers.has(options.name)) {
        log.warn(`Security provider "${options.name}" is already registered!`)

        continue
      }

      const adapter = new RedisSessionStoreAdapter(redisClient, options)
      const provider = new SecurityProvider(options, adapter, connection)

      providers.set(options.name, provider)
    }

    return providers
  }
}
