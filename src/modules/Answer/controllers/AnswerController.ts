import { FastifyRequest, FastifyReply } from 'fastify'
import {
  SubmitAnswerRequest,
  UpdateAnswerRequest,
  AnswerParams,
  UserIdParams,
  QuizIdParams,
  UserQuizParams,
  QuizIdsRequest,
  GetAnswersQuery,
} from '@/modules/Answer/interfaces/Answer'
import { convertNullToUndefined } from '@/utils/dbValueConverter'
import { In, MoreThan, FindManyOptions } from 'typeorm'

export class AnswerController {
  static async getUserAnswersByQuizIds(
    request: FastifyRequest<{ Body: QuizIdsRequest }>,
    reply: FastifyReply,
  ) {
    try {
      const { quizIds } = request.body
      const userId = request.user?.id // 인증된 사용자 ID

      if (!userId) {
        reply.status(401).send({
          success: false,
          error: 'Unauthorized: User ID not found',
        })
        return
      }

      const answers = await request.server.repositories.answer.find({
        where: {
          userId,
          quizId: In(quizIds),
        },
      })

      reply.status(200).send({
        success: true,
        data: answers.map((answer) => ({
          ...answer,
          timeTaken: convertNullToUndefined(answer.timeTaken),
        })),
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get user answers by quiz ids',
      })
    }
  }

  static async getAllAnswers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const answers = await request.server.repositories.answer.find({
        relations: ['user', 'quiz'],
      })

      reply.status(200).send({
        success: true,
        data: answers.map((answer) => ({
          ...answer,
          timeTaken: convertNullToUndefined(answer.timeTaken),
        })),
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get answers',
      })
    }
  }

  static async submitAnswer(
    request: FastifyRequest<{ Body: SubmitAnswerRequest }>,
    reply: FastifyReply,
  ) {
    try {
      const { userId, quizId, categoryId, userAnswer, timeTaken } = request.body

      // 퀴즈 정보 조회
      const quiz = await request.server.repositories.quiz.findOne({
        where: { id: quizId },
      })

      if (!quiz) {
        reply.status(404).send({
          success: false,
          error: 'Quiz not found',
        })
        return
      }

      // 답안 정규화 (공백 제거 및 소문자 치환)
      const normalizedUserAnswer = userAnswer.trim().toLowerCase()
      const normalizedCorrectAnswer = quiz.correct.trim().toLowerCase()

      // 정답 확인
      const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer

      // 답안 생성
      let point = isCorrect ? request.body.point || 0 : 0
      let bonusPoint = isCorrect ? request.body.bonusPoint || 0 : 0

      const answer = request.server.repositories.answer.create({
        userId,
        quizId,
        categoryId,
        userAnswer,
        isCorrect,
        point,
        bonusPoint,
        timeTaken,
      })

      const savedAnswer = await request.server.repositories.answer.save(answer)

      // 퀴즈 통계 업데이트
      if (isCorrect) {
        quiz.correctCount += 1
      } else {
        quiz.wrongCount += 1
      }

      // 정답률 계산 및 난이도 업데이트
      const totalAnswers = quiz.correctCount + quiz.wrongCount
      const accuracy =
        totalAnswers > 0 ? (quiz.correctCount / totalAnswers) * 100 : 0

      // 정답률에 따른 난이도 업데이트
      let difficulty = 'A'
      if (accuracy <= 30) {
        difficulty = 'A'
      } else if (accuracy <= 60) {
        difficulty = 'B'
      } else if (accuracy <= 90) {
        difficulty = 'C'
      } else {
        difficulty = 'D'
      }

      quiz.difficulty = difficulty
      await request.server.repositories.quiz.save(quiz)

      reply.status(201).send({
        success: true,
        data: {
          answer: {
            ...savedAnswer,
            timeTaken: convertNullToUndefined(savedAnswer.timeTaken),
          },
          correctAnswer: quiz.correct,
          accuracy: Math.round(accuracy * 10) / 10,
          difficulty: quiz.difficulty,
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to submit answer',
      })
    }
  }

  static async getAnswersByUserId(
    request: FastifyRequest<{ Params: UserIdParams; Querystring: GetAnswersQuery }>,
    reply: FastifyReply,
  ) {
    try {
      const { userId } = request.params
      const { since } = request.query // Get 'since' from query

      const findOptions: FindManyOptions = {
        where: {
          userId,
          ...(since && { createdAt: MoreThan(new Date(since)) }),
        },
        relations: ['quiz'],
      }

      const answers = await request.server.repositories.answer.find(findOptions)

      const syncTimestamp = new Date().toISOString()

      reply.status(200).send({
        success: true,
        data: {
          syncTimestamp: syncTimestamp,
          answers: answers.map((answer) => ({
            ...answer,
            timeTaken: convertNullToUndefined(answer.timeTaken),
          })),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get answers by user',
      })
    }
  }

  static async getAnswersByQuizId(
    request: FastifyRequest<{ Params: QuizIdParams }>,
    reply: FastifyReply
  ) {
    try {
      const { quizId } = request.params
      
      const answers = await request.server.repositories.answer.find({
        where: { quizId },
        relations: ['user'],
      })

      reply.status(200).send({
        success: true,
        data: answers.map((answer) => ({
          ...answer,
          timeTaken: convertNullToUndefined(answer.timeTaken),
        })),
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get answers by quiz',
      })
    }
  }

  static async getUserAnswerForQuiz(
    request: FastifyRequest<{ Params: UserQuizParams }>,
    reply: FastifyReply
  ) {
    try {
      const { userId, quizId } = request.params
      
      const answer = await request.server.repositories.answer.findOne({
        where: { userId, quizId },
        relations: ['user', 'quiz'],
      })

      if (!answer) {
        reply.status(404).send({
          success: false,
          error: 'Answer not found',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: {
          ...answer,
          timeTaken: convertNullToUndefined(answer.timeTaken),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get user answer for quiz',
      })
    }
  }

  static async getUserStats(
    request: FastifyRequest<{ Params: UserIdParams }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params
      
      const totalAnswers = await request.server.repositories.answer.count({
        where: { userId },
      })

      const correctAnswers = await request.server.repositories.answer.count({
        where: { userId, isCorrect: true },
      })

      const wrongAnswers = totalAnswers - correctAnswers
      const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0

      reply.status(200).send({
        success: true,
        data: {
          totalAnswers,
          correctAnswers,
          wrongAnswers,
          accuracy: Math.round(accuracy * 100),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get user stats',
      })
    }
  }

  static async getQuizStats(
    request: FastifyRequest<{ Params: QuizIdParams }>,
    reply: FastifyReply
  ) {
    try {
      const { quizId } = request.params
      
      const totalAnswers = await request.server.repositories.answer.count({
        where: { quizId },
      })

      const correctAnswers = await request.server.repositories.answer.count({
        where: { quizId, isCorrect: true },
      })

      const wrongAnswers = totalAnswers - correctAnswers
      const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0

      reply.status(200).send({
        success: true,
        data: {
          totalAnswers,
          correctAnswers,
          wrongAnswers,
          accuracy: Math.round(accuracy * 100),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get quiz stats',
      })
    }
  }

  static async getAnswerById(
    request: FastifyRequest<{ Params: AnswerParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const answer = await request.server.repositories.answer.findOne({
        where: { id },
        relations: ['user', 'quiz'],
      })

      if (!answer) {
        reply.status(404).send({
          success: false,
          error: 'Answer not found',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: {
          ...answer,
          timeTaken: convertNullToUndefined(answer.timeTaken),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get answer',
      })
    }
  }

  static async updateAnswer(
    request: FastifyRequest<{ Params: AnswerParams; Body: UpdateAnswerRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const answer = await request.server.repositories.answer.findOne({
        where: { id },
      })

      if (!answer) {
        reply.status(404).send({
          success: false,
          error: 'Answer not found',
        })
        return
      }

      await request.server.repositories.answer.update(id, request.body)
      
      const updatedAnswer = await request.server.repositories.answer.findOne({
        where: { id },
        relations: ['user', 'quiz'],
      })

      if (!updatedAnswer) {
        reply.status(404).send({
          success: false,
          error: 'Answer not found',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: {
          ...updatedAnswer,
          timeTaken: convertNullToUndefined(updatedAnswer.timeTaken),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to update answer',
      })
    }
  }

  static async deleteAnswer(
    request: FastifyRequest<{ Params: AnswerParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const answer = await request.server.repositories.answer.findOne({
        where: { id },
      })

      if (!answer) {
        reply.status(404).send({
          success: false,
          error: 'Answer not found',
        })
        return
      }

      await request.server.repositories.answer.remove(answer)

      reply.status(200).send({
        success: true,
        message: 'Answer deleted successfully',
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to delete answer',
      })
    }
  }
}