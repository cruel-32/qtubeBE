import { FastifyRequest, FastifyReply } from 'fastify'
import {
  CreateQuizRequest,
  UpdateQuizRequest,
  QuizParams,
  QuizQuery,
  CategoryParams,
  TypeParams,
  UnsolvedQuizQuery,
  QuizIdsRequest,
} from '@/modules/Quiz/interfaces/Quiz'
import { convertNullToUndefined } from '@/utils/dbValueConverter';

export class QuizController {
  static async createQuiz(
    request: FastifyRequest<{ Body: CreateQuizRequest }>,
    reply: FastifyReply
  ) {
    try {
      const quiz = request.server.repositories.quiz.create(request.body)
      const savedQuiz = await request.server.repositories.quiz.save(quiz)
      
      reply.status(201).send({
        success: true,
        data: {
            ...savedQuiz,
            answer1: convertNullToUndefined(savedQuiz.answer1),
            answer2: convertNullToUndefined(savedQuiz.answer2),
            answer3: convertNullToUndefined(savedQuiz.answer3),
            answer4: convertNullToUndefined(savedQuiz.answer4),
            explanation: convertNullToUndefined(savedQuiz.explanation),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to create quiz',
      })
    }
  }

  static async getAllQuizzes(
    request: FastifyRequest<{ Querystring: QuizQuery }>,
    reply: FastifyReply
  ) {
    try {
      const { page, limit, type, categoryId, difficulty } = request.query
      const skip = (page - 1) * limit

      const queryBuilder = request.server.repositories.quiz.createQueryBuilder('quiz')

      if (type !== undefined) {
        queryBuilder.andWhere('quiz.type = :type', { type })
      }
      if (categoryId) {
        queryBuilder.andWhere('quiz.categoryId = :categoryId', { categoryId })
      }
      if (difficulty) {
        queryBuilder.andWhere('quiz.difficulty = :difficulty', { difficulty })
      }

      const [quizzes, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount()

      reply.status(200).send({
        success: true,
        data: {
          quizzes,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get quizzes',
      })
    }
  }

  static async getRandomQuiz(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const quiz = await request.server.repositories.quiz
        .createQueryBuilder('quiz')
        .orderBy('RANDOM()')
        .getOne()

      if (!quiz) {
        reply.status(404).send({
          success: false,
          error: 'No quiz found',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: quiz,
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get random quiz',
      })
    }
  }

  static async getQuizzesByCategory(
    request: FastifyRequest<{ Params: CategoryParams }>,
    reply: FastifyReply
  ) {
    try {
      const { categoryId } = request.params
      
      const quizzes = await request.server.repositories.quiz.find({
        where: { categoryId },
      })

      reply.status(200).send({
        success: true,
        data: quizzes.map((quiz) => ({
          ...quiz,
          answer1: convertNullToUndefined(quiz.answer1),
          answer2: convertNullToUndefined(quiz.answer2),
          answer3: convertNullToUndefined(quiz.answer3),
          answer4: convertNullToUndefined(quiz.answer4),
          explanation: convertNullToUndefined(quiz.explanation),
        })),
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get quizzes by category',
      })
    }
  }

  static async getQuizzesByType(
    request: FastifyRequest<{ Params: TypeParams }>,
    reply: FastifyReply
  ) {
    try {
      const { type } = request.params
      
      const quizzes = await request.server.repositories.quiz.find({
        where: { type },
      })

      reply.status(200).send({
        success: true,
        data: quizzes.map((quiz) => ({
          ...quiz,
          answer1: convertNullToUndefined(quiz.answer1),
          answer2: convertNullToUndefined(quiz.answer2),
          answer3: convertNullToUndefined(quiz.answer3),
          answer4: convertNullToUndefined(quiz.answer4),
          explanation: convertNullToUndefined(quiz.explanation),
        })),
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get quizzes by type',
      })
    }
  }

  static async getQuizById(
    request: FastifyRequest<{ Params: QuizParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const quiz = await request.server.repositories.quiz.findOne({
        where: { id },
      })

      if (!quiz) {
        reply.status(404).send({
          success: false,
          error: 'Quiz not found',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: {
          ...quiz,
          answer1: convertNullToUndefined(quiz.answer1),
          answer2: convertNullToUndefined(quiz.answer2),
          answer3: convertNullToUndefined(quiz.answer3),
          answer4: convertNullToUndefined(quiz.answer4),
          explanation: convertNullToUndefined(quiz.explanation),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get quiz',
      })
    }
  }

  static async updateQuiz(
    request: FastifyRequest<{ Params: QuizParams; Body: UpdateQuizRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const quiz = await request.server.repositories.quiz.findOne({
        where: { id },
      })

      if (!quiz) {
        reply.status(404).send({
          success: false,
          error: 'Quiz not found',
        })
        return
      }

      await request.server.repositories.quiz.update(id, request.body)
      
      const updatedQuiz = await request.server.repositories.quiz.findOne({
        where: { id },
      })

      if (!updatedQuiz) {
        reply.status(404).send({
          success: false,
          error: 'Quiz not found',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: {
          ...updatedQuiz,
          answer1: convertNullToUndefined(updatedQuiz.answer1),
          answer2: convertNullToUndefined(updatedQuiz.answer2),
          answer3: convertNullToUndefined(updatedQuiz.answer3),
          answer4: convertNullToUndefined(updatedQuiz.answer4),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to update quiz',
      })
    }
  }

  static async deleteQuiz(
    request: FastifyRequest<{ Params: QuizParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const quiz = await request.server.repositories.quiz.findOne({
        where: { id },
      })

      if (!quiz) {
        reply.status(404).send({
          success: false,
          error: 'Quiz not found',
        })
        return
      }

      await request.server.repositories.quiz.remove(quiz)

      reply.status(200).send({
        success: true,
        message: 'Quiz deleted successfully',
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to delete quiz',
      })
    }
  }

  static async incrementCorrectCount(
    request: FastifyRequest<{ Params: QuizParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const quiz = await request.server.repositories.quiz.findOne({
        where: { id },
      })

      if (!quiz) {
        reply.status(404).send({
          success: false,
          error: 'Quiz not found',
        })
        return
      }

      quiz.correctCount += 1
      await request.server.repositories.quiz.save(quiz)

      reply.status(200).send({
        success: true,
        data: {
          ...quiz,
          answer1: convertNullToUndefined(quiz.answer1),
          answer2: convertNullToUndefined(quiz.answer2),
          answer3: convertNullToUndefined(quiz.answer3),
          answer4: convertNullToUndefined(quiz.answer4),
          explanation: convertNullToUndefined(quiz.explanation),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to increment correct count',
      })
    }
  }

  static async incrementWrongCount(
    request: FastifyRequest<{ Params: QuizParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const quiz = await request.server.repositories.quiz.findOne({
        where: { id },
      })

      if (!quiz) {
        reply.status(404).send({
          success: false,
          error: 'Quiz not found',
        })
        return
      }

      quiz.wrongCount += 1
      await request.server.repositories.quiz.save(quiz)

      reply.status(200).send({
        success: true,
        data: {
          ...quiz,
          answer1: convertNullToUndefined(quiz.answer1),
          answer2: convertNullToUndefined(quiz.answer2),
          answer3: convertNullToUndefined(quiz.answer3),
          answer4: convertNullToUndefined(quiz.answer4),
          explanation: convertNullToUndefined(quiz.explanation),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to increment wrong count',
      })
    }
  }

  static async getUnsolvedQuizzes(
    request: FastifyRequest<{ Querystring: UnsolvedQuizQuery }>,
    reply: FastifyReply
  ) {
    try {
      const { userId, categoryId, limit } = request.query as UnsolvedQuizQuery

      // 사용자가 이미 풀어본 퀴즈 ID들을 가져옴 (동일 카테고리 내에서만)
      const solvedQuizIds = await request.server.repositories.answer
        .createQueryBuilder('answer')
        .select('answer.quizId')
        .where('answer.userId = :userId', { userId })
        .andWhere('answer.quizId IN (SELECT id FROM quiz WHERE "categoryId" = :categoryId)', { categoryId })
        .getRawMany()

      const solvedIds = solvedQuizIds.map(item => item.answer_quizId)

      // 퀴즈 쿼리 빌더 생성
      const queryBuilder = request.server.repositories.quiz
        .createQueryBuilder('quiz')
        .where('quiz.categoryId = :categoryId', { categoryId })

      // 이미 푼 문제들은 제외
      if (solvedIds.length > 0) {
        queryBuilder.andWhere('quiz.id NOT IN (:...solvedIds)', { solvedIds })
      }

      // 랜덤으로 정렬하고 제한된 개수만 가져옴
      const quizzes = await queryBuilder
        .orderBy('RANDOM()')
        .limit(limit)
        .getMany()

      if (quizzes.length < limit) {
        reply.status(404).send({
          success: false,
          error: '퀴즈가 없습니다',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: {
          quizzes: quizzes.map((quiz) => ({
            ...quiz,
            answer1: convertNullToUndefined(quiz.answer1),
            answer2: convertNullToUndefined(quiz.answer2),
            answer3: convertNullToUndefined(quiz.answer3),
            answer4: convertNullToUndefined(quiz.answer4),
            explanation: convertNullToUndefined(quiz.explanation),
          })),
          total: quizzes.length,
          requestedLimit: limit,
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get unsolved quizzes',
      })
    }
  }

  static async getQuizzesByIds(
    request: FastifyRequest<{ Body: QuizIdsRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { quizIds } = request.body

      const quizzes = await request.server.repositories.quiz
        .createQueryBuilder('quiz')
        .where('quiz.id IN (:...quizIds)', { quizIds })
        .getMany()

      reply.status(200).send({
        success: true,
        data: quizzes.map((quiz) => ({
          ...quiz,
          answer1: convertNullToUndefined(quiz.answer1),
          answer2: convertNullToUndefined(quiz.answer2),
          answer3: convertNullToUndefined(quiz.answer3),
          answer4: convertNullToUndefined(quiz.answer4),
          explanation: convertNullToUndefined(quiz.explanation),
        })),
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get quizzes by ids',
      })
    }
  }
}