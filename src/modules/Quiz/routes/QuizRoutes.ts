import { FastifyInstance } from 'fastify'
import { QuizController } from '@/modules/Quiz/controllers/QuizController'
import {
  CreateQuizSchema,
  UpdateQuizSchema,
  QuizParamsSchema,
  QuizQuerySchema,
  CategoryParamsSchema,
  TypeParamsSchema,
  UnsolvedQuizQuery,
  QuizIdsRequestSchema,
} from '@/modules/Quiz/interfaces/Quiz'

const quizRoutes = async (fastify: FastifyInstance) => {
  // 퀴즈 생성
  fastify.post('/', {
    schema: {
      body: CreateQuizSchema,
      tags: ['Quiz'],
      description: '새로운 퀴즈를 생성합니다',
    },
    handler: QuizController.createQuiz,
  })

  // quizIds 배열을 받아 해당하는 퀴즈를 조회
  fastify.post('/by-ids', {
    schema: {
      body: QuizIdsRequestSchema,
      tags: ['Quiz'],
      description: 'quizId 배열을 받아 해당하는 퀴즈를 조회합니다.',
    },
    handler: QuizController.getQuizzesByIds,
  })

  // 전체 퀴즈 조회 (페이지네이션, 필터링)
  fastify.get('/', {
    schema: {
      querystring: QuizQuerySchema,
      tags: ['Quiz'],
      description: '퀴즈 목록을 조회합니다 (페이지네이션, 필터링 지원)',
    },
    handler: QuizController.getAllQuizzes,
  })

  // 랜덤 퀴즈 조회
  fastify.get('/random', {
    schema: {
      tags: ['Quiz'],
      description: '랜덤 퀴즈를 조회합니다',
    },
    handler: QuizController.getRandomQuiz,
  })

  // 풀지 않은 퀴즈 조회
  fastify.get('/random/unsolved', {
    schema: {
      querystring: UnsolvedQuizQuery,
      tags: ['Quiz'],
      description: '사용자가 풀지 않은 퀴즈를 카테고리별로 조회합니다 (1-30개)',
    },
    handler: QuizController.getUnsolvedQuizzes,
  })

  // 카테고리별 퀴즈 조회
  fastify.get('/category/:categoryId', {
    schema: {
      params: CategoryParamsSchema,
      tags: ['Quiz'],
      description: '특정 카테고리의 퀴즈를 조회합니다',
    },
    handler: QuizController.getQuizzesByCategory,
  })

  // 타입별 퀴즈 조회
  fastify.get('/type/:type', {
    schema: {
      params: TypeParamsSchema,
      tags: ['Quiz'],
      description: '특정 타입의 퀴즈를 조회합니다',
    },
    handler: QuizController.getQuizzesByType,
  })

  // 퀴즈 상세 조회
  fastify.get('/:id', {
    schema: {
      params: QuizParamsSchema,
      tags: ['Quiz'],
      description: '특정 퀴즈의 상세 정보를 조회합니다',
    },
    handler: QuizController.getQuizById,
  })

  // 퀴즈 업데이트
  fastify.put('/:id', {
    schema: {
      params: QuizParamsSchema,
      body: UpdateQuizSchema,
      tags: ['Quiz'],
      description: '퀴즈 정보를 업데이트합니다',
    },
    handler: QuizController.updateQuiz,
  })

  // 퀴즈 삭제
  fastify.delete('/:id', {
    schema: {
      params: QuizParamsSchema,
      tags: ['Quiz'],
      description: '퀴즈를 삭제합니다',
    },
    handler: QuizController.deleteQuiz,
  })

  // 정답 횟수 증가
  fastify.patch('/:id/correct', {
    schema: {
      params: QuizParamsSchema,
      tags: ['Quiz'],
      description: '퀴즈의 정답 횟수를 증가시킵니다',
    },
    handler: QuizController.incrementCorrectCount,
  })

  // 오답 횟수 증가
  fastify.patch('/:id/wrong', {
    schema: {
      params: QuizParamsSchema,
      tags: ['Quiz'],
      description: '퀴즈의 오답 횟수를 증가시킵니다',
    },
    handler: QuizController.incrementWrongCount,
  })
}

export default quizRoutes