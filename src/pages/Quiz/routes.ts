import { FastifyInstance } from 'fastify'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import {
  CategoryParamsSchema,
} from '@/modules/Quiz/interfaces/Quiz'

const pageoutes = async (fastify: FastifyInstance) => {
  // 퀴즈 공유 페이지
  fastify.get('/share/:categoryId', {
    schema: {
      params: CategoryParamsSchema,
      querystring: z.object({
        quizIds: z.string(),
      }),
      tags: ['Quiz'],
      description: '퀴즈 공유를 위한 HTML 페이지를 제공합니다',
    },
    handler: async (request, reply) => {
      try {
        const { categoryId } = request.params as { categoryId: string }
        const { quizIds } = request.query as { quizIds?: string }

        const templatePath = path.resolve(
          process.cwd(),
          'src/pages/Quiz/templates/sharePage.html',
        )
        const htmlTemplate = fs.readFileSync(templatePath, 'utf-8')

        const renderedHtml = htmlTemplate
          .replace(/{{categoryId}}/g, categoryId)
          .replace(/{{quizIds}}/g, quizIds || '')

        return reply.type('text/html; charset=utf-8').send(renderedHtml)
      } catch (error) {
        fastify.log.error(error)
        return reply.status(500).send({ message: 'Internal Server Error' })
      }
    },
  })
}

export default pageoutes