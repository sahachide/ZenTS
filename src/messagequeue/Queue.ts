import { Queue as BullMQQueue, QueueScheduler } from 'bullmq'
import type { QueueOptions, QueueSchedulerOptions } from 'bullmq'

import type { QueueOption } from '../types/interfaces'
import Redis from 'ioredis'

export class Queue {
  protected queue: BullMQQueue
  protected scheduler: QueueScheduler

  constructor(public option: QueueOption, redisClient: Redis.Redis) {
    const bullMQOptions: QueueOptions = {
      // @ts-ignore
      connection: redisClient,
      prefix: option.prefix,
    }

    if (option.defaultJobOptions) {
      bullMQOptions.defaultJobOptions = option.defaultJobOptions
    }

    this.queue = new BullMQQueue(option.name, bullMQOptions)

    // scheduler is enabled by default
    if (typeof option.scheduler !== 'boolean' || option.scheduler) {
      const schedulerOptions: QueueSchedulerOptions = {
        // @ts-ignore
        connection: redisClient,
      }

      if (typeof option.maxStalledCount === 'number') {
        schedulerOptions.maxStalledCount = option.maxStalledCount
      }

      if (typeof option.stalledInterval === 'number') {
        schedulerOptions.stalledInterval = option.stalledInterval
      }

      this.scheduler = new QueueScheduler(option.name, schedulerOptions)
    } else {
      this.scheduler = null
    }

    if (option.log) {
      // TODO: implement https://github.com/taskforcesh/bullmq/blob/master/docs/gitbook/api/bullmq.queueevents.md
    }
  }
}
