import type { Redis } from 'ioredis'

export class RedisSessionStoreAdapter {
  constructor(protected readonly redisClient: Redis) {}
}
