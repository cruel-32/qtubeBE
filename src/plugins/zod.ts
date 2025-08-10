import fp from 'fastify-plugin'
import { ZodError } from 'zod'
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

export default fp(async function (fastify) {
  // Zod Type Provider 등록
  fastify.withTypeProvider<ZodTypeProvider>()
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      reply.status(400).send({
        error: 'Validation Error',
        details: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      })
      return
    }

    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      reply.status(error.statusCode).send({
        error: error.name || 'Bad Request',
        message: error.message,
      })
      return
    }

    fastify.log.error(error)
    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    })
  })
})