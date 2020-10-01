import type { Entities, SecurityStrategies } from '../types/types'

import type { Connection } from 'typeorm'
import { SecurityProvider } from './SecurityProvider'
import { SecurityStrategy } from './SecurityStrategy'
import { config } from '../config/config'
import { isObject } from '../utils/isObject'
import { log } from '../log/logger'

export class SecurityStrategyLoader {
  public load(entities: Entities, connection: Connection): SecurityStrategies {
    const strategies = new Map() as SecurityStrategies

    if (!isObject(config.security) || !config.security.enable) {
      return strategies
    }

    for (const strategyConfig of config.security.strategies) {
      const entity =
        typeof strategyConfig.entity === 'string'
          ? entities.get(strategyConfig.entity.toLowerCase())
          : null

      const provider = new SecurityProvider(strategyConfig, entity)

      if (strategies.has(provider.name)) {
        log.warn(`Security strategy "${provider.name}" is already registered!`)

        continue
      }

      const strategy = new SecurityStrategy(provider, connection)

      strategies.set(provider.name, strategy)
    }

    return strategies
  }
}
