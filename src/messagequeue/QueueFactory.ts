import { Queue } from './Queue'
import Redis from 'ioredis'
import { config } from '../config/config'

export class QueueFactory {
  protected queues: Map<string, Queue> = new Map<string, Queue>()

  constructor(redisClient: Redis.Redis | null) {
    if (!config.mq?.enable || !Array.isArray(config.mq?.queues) || !config.redis?.enable) {
      return
    }

    for (const option of config.mq.queues) {
      const queue = new Queue(option, redisClient)

      this.queues.set(option.name, queue)
    }
  }
}
