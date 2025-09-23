import { FastifyInstance } from 'fastify'
import fs from 'fs'
import path from 'path'

const privacyRoutes = async (fastify: FastifyInstance) => {
  // 개인정보 처리방침 페이지
  fastify.get('/policy', {
    schema: {
      tags: ['Privacy'],
      description: 'iOS 앱 스토어 승인을 위한 개인정보 처리방침 페이지를 제공합니다',
      response: {
        200: {
          type: 'string',
          description: 'HTML 페이지'
        }
      }
    },
    handler: async (request, reply) => {
      try {
        const templatePath = path.join(__dirname, 'templates', 'privacyPolicy.html')
        const htmlTemplate = fs.readFileSync(templatePath, 'utf-8')

        return reply.type('text/html; charset=utf-8').send(htmlTemplate)
      } catch (error) {
        fastify.log.error(error)
        return reply.status(500).send({ message: 'Internal Server Error' })
      }
    },
  })
}

export default privacyRoutes
