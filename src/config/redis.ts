import { FastifyInstance } from 'fastify'
import { config } from '@/config/env'

export const registerRedis = async (fastify: FastifyInstance) => {
  await fastify.register(require('@fastify/redis'), {
    host: config.redis.host,
    port: config.redis.port,
    lazyConnect: true,
    retryStrategy: (times: number) => {
      if (times > 5) return undefined // 재시도 5회 후 포기
      return Math.min(times * 100, 2000) // 점진적 backoff
    }
  })
}

export const connectRedis = async (fastify: FastifyInstance): Promise<void> => {
  try {
    await registerRedis(fastify)
    fastify.log.info('Redis connection established successfully')
  } catch (error) {
    fastify.log.error('Error connecting to Redis:', error)
    throw error
  }
}