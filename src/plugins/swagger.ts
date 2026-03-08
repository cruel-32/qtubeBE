import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { ZodSchema } from 'zod'
import { config } from '@/config/env'

export default fp(async function (fastify) {
  if (!config.swaggerEnabled) {
    return
  }

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'QTube API',
        description: 'Quiz Application API',
        version: '1.0.0',
      },
      servers: [
        {
          url: config.apiHost || 'http://localhost:8080',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: ({ schema, url }) => {
      if (schema) {
        const transformed = {
          ...schema,
        }

        // body 스키마 변환
        if (schema.body && typeof schema.body === 'object' && '_def' in schema.body) {
          transformed.body = zodToJsonSchema(schema.body as ZodSchema)
        }

        // params 스키마 변환
        if (schema.params && typeof schema.params === 'object' && '_def' in schema.params) {
          transformed.params = zodToJsonSchema(schema.params as ZodSchema)
        }

        // querystring 스키마 변환
        if (schema.querystring && typeof schema.querystring === 'object' && '_def' in schema.querystring) {
          transformed.querystring = zodToJsonSchema(schema.querystring as ZodSchema)
        }

        // response 스키마 변환
        if (schema.response) {
          const transformedResponse: any = {}
          for (const [statusCode, responseSchema] of Object.entries(schema.response)) {
            if (responseSchema && typeof responseSchema === 'object' && '_def' in responseSchema) {
              transformedResponse[statusCode] = zodToJsonSchema(responseSchema as ZodSchema)
            } else {
              transformedResponse[statusCode] = responseSchema
            }
          }
          transformed.response = transformedResponse
        }

        return { schema: transformed, url }
      }
      return { schema, url }
    },
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: false,
  })
})