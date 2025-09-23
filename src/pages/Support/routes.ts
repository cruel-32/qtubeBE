import { FastifyInstance } from 'fastify'
import fs from 'fs'
import path from 'path'

const supportRoutes = async (fastify: FastifyInstance) => {
  // 앱 지원 정보 페이지
  fastify.get('/info', {
    schema: {
      tags: ['Support'],
      description: 'iOS 앱 스토어 승인을 위한 앱 지원 정보 페이지를 제공합니다',
      response: {
        200: {
          type: 'string',
          description: 'HTML 페이지'
        }
      }
    },
    handler: async (request, reply) => {
      try {
        const templatePath = path.join(__dirname, 'templates', 'supportInfo.html')
        const htmlTemplate = fs.readFileSync(templatePath, 'utf-8')

        return reply.type('text/html; charset=utf-8').send(htmlTemplate)
      } catch (error) {
        fastify.log.error(error)
        return reply.status(500).send({ message: 'Internal Server Error' })
      }
    },
  })
}

export default supportRoutes
