import type { DatabaseContainer } from '../database/DatabaseContainer'
import { DatabaseSessionStoreAdapter } from './stores/DatabaseSessionStoreAdapter'
import { RedisSessionStoreAdapter } from './stores/RedisSessionStoreAdapter'
import type { SecurityProviderOptions } from './SecurityProviderOptions'
import type { SessionStoreAdapter } from '../types/interfaces'

export class SessionStoreAdapterFactory {
  constructor(protected databaseContainer: DatabaseContainer) {}

  public build(providerOptions: SecurityProviderOptions): SessionStoreAdapter {
    let adapter

    switch (providerOptions.storeType) {
      case 'redis':
        adapter = new RedisSessionStoreAdapter(this.databaseContainer, providerOptions)
        break

      case 'database':
        adapter = new DatabaseSessionStoreAdapter(this.databaseContainer, providerOptions)
        break

      default:
        throw new Error(`Invalid session store "${providerOptions.storeType}"`)
    }

    return adapter
  }
}
