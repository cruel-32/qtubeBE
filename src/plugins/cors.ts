import fp from 'fastify-plugin'
import cors from '@fastify/cors'
import { config } from '@/config/env'

export default fp(async function (fastify) {
  await fastify.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
})