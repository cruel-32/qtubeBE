import { FastifyInstance } from 'fastify'
import { AnswerController } from '@/modules/Answer/controllers/AnswerController'
import {
  SubmitAnswerSchema,
  UpdateAnswerSchema,
  AnswerParamsSchema,
  UserIdParamsSchema,
  QuizIdParamsSchema,
  UserQuizParamsSchema,
  QuizIdsRequestSchema,
  GetAnswersQuerySchema,
} from '@/modules/Answer/interfaces/Answer'

const answerRoutes = async (fastify: FastifyInstance) => {
  // quizId 배열을 받아서 사용자의 답안을 조회
  fastify.post('/by-quiz-ids', {
    schema: {
      body: QuizIdsRequestSchema,
      tags: ['Answer'],
      description: 'quizId 배열을 받아서 사용자의 답안을 조회합니다.',
    },
    handler: AnswerController.getUserAnswersByQuizIds,
  })

  // 전체 답안 조회
  fastify.get('/', {
    schema: {
      tags: ['Answer'],
      description: '모든 답안을 조회합니다',
    },
    handler: AnswerController.getAllAnswers,
  })

  // 답안 제출
  fastify.post('/submit', {
    schema: {
      body: SubmitAnswerSchema,
      tags: ['Answer'],
      description: '답안을 제출하고 정답 여부를 확인합니다',
    },
    handler: AnswerController.submitAnswer,
  })

  // 사용자별 답안 조회
  fastify.get('/user/:userId', {
    schema: {
      params: UserIdParamsSchema,
      querystring: GetAnswersQuerySchema,
      tags: ['Answer'],
      description: '특정 사용자의 모든 답안을 조회합니다',
    },
    handler: AnswerController.getAnswersByUserId,
  })

  // 퀴즈별 답안 조회
  fastify.get('/quiz/:quizId', {
    schema: {
      params: QuizIdParamsSchema,
      tags: ['Answer'],
      description: '특정 퀴즈의 모든 답안을 조회합니다',
    },
    handler: AnswerController.getAnswersByQuizId,
  })

  // 특정 사용자의 특정 퀴즈 답안 조회
  fastify.get('/user/:userId/quiz/:quizId', {
    schema: {
      params: UserQuizParamsSchema,
      tags: ['Answer'],
      description: '특정 사용자의 특정 퀴즈 답안을 조회합니다',
    },
    handler: AnswerController.getUserAnswerForQuiz,
  })

  // 사용자 답안 통계
  fastify.get('/stats/user/:userId', {
    schema: {
      params: UserIdParamsSchema,
      tags: ['Answer'],
      description: '사용자의 답안 통계를 조회합니다',
    },
    handler: AnswerController.getUserStats,
  })

  // 퀴즈 답안 통계
  fastify.get('/stats/quiz/:quizId', {
    schema: {
      params: QuizIdParamsSchema,
      tags: ['Answer'],
      description: '퀴즈의 답안 통계를 조회합니다',
    },
    handler: AnswerController.getQuizStats,
  })

  // 답안 상세 조회
  fastify.get('/:id', {
    schema: {
      params: AnswerParamsSchema,
      tags: ['Answer'],
      description: '특정 답안의 상세 정보를 조회합니다',
    },
    handler: AnswerController.getAnswerById,
  })

  // 답안 업데이트
  fastify.put('/:id', {
    schema: {
      params: AnswerParamsSchema,
      body: UpdateAnswerSchema,
      tags: ['Answer'],
      description: '답안 정보를 업데이트합니다',
    },
    handler: AnswerController.updateAnswer,
  })

  // 답안 삭제
  fastify.delete('/:id', {
    schema: {
      params: AnswerParamsSchema,
      tags: ['Answer'],
      description: '답안을 삭제합니다',
    },
    handler: AnswerController.deleteAnswer,
  })
}

export default answerRoutes
