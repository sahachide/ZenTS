import Redis from 'ioredis'
import { config } from '../config/config'
import { log } from '../log/logger'

export async function createRedisClient(): Promise<Redis.Redis | null> {
  if (!config.redis?.enable) {
    return null
  }

  return new Promise((resolve, reject) => {
    const client = new Redis(
      Object.assign({}, config.redis, {
        lazyConnect: false,
        enableReadyCheck: true,
      }),
    )

    if (config.redis?.log) {
      client.on('connect', () => log.success('Redis client connected successfully!'))
      client.on('ready', () => log.success('Redis connection is ready to accept commands!'))
      client.on('error', (err) => log.error(err))
      client.on('close', () => log.info('Connection to redis server closed.'))
      client.on('reconnecting', () => log.info('Redis client reconnecting to server'))
    }

    let isReadySend = false
    client.once('ready', () => {
      isReadySend = true
      resolve(client)
    })
    client.once('end', () => {
      if (!isReadySend) {
        reject('Failed to connect to redis server.')
      }
    })
  })
}
