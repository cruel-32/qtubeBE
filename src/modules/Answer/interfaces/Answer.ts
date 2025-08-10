import { z } from 'zod'

export const AnswerSchema = z.object({
  id: z.number().int().positive(),
  userId: z.string(),
  quizId: z.number().int().positive(),
  userAnswer: z.string(),
  isCorrect: z.boolean(),
  point: z.number().int(),
  bonusPoint: z.number().int(),
  timeTaken: z.number().int().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const SubmitAnswerSchema = z.object({
  userId: z.string(),
  quizId: z.number().int().positive('퀴즈 ID는 양수여야 합니다'),
  categoryId: z.number().int().positive('카테고리 ID는 양수여야 합니다'),
  userAnswer: z.string().min(1, '답안은 필수입니다'),
  point: z.number().int().optional(),
  bonusPoint: z.number().int().optional(),
  timeTaken: z.number().int().optional(),
})

export const UpdateAnswerSchema = z.object({
  userAnswer: z.string().min(1, '답안은 필수입니다').optional(),
  isCorrect: z.boolean().optional(),
  point: z.number().int().optional(),
  bonusPoint: z.number().int().optional(),
  timeTaken: z.number().int().optional(),
})

export const AnswerParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
})

export const UserIdParamsSchema = z.object({
  userId: z.string(),
})

export const GetAnswersQuerySchema = z.object({
  since: z.string().datetime().optional(),
})

export const QuizIdParamsSchema = z.object({
  quizId: z.string().transform((val) => parseInt(val, 10)),
})

export const UserQuizParamsSchema = z.object({
  userId: z.string(),
  quizId: z.string().transform((val) => parseInt(val, 10)),
})

export const QuizIdsRequestSchema = z.object({
  quizIds: z.array(z.number().int().positive()),
})

export type Answer = z.infer<typeof AnswerSchema>
export type SubmitAnswerRequest = z.infer<typeof SubmitAnswerSchema>
export type UpdateAnswerRequest = z.infer<typeof UpdateAnswerSchema>
export type AnswerParams = z.infer<typeof AnswerParamsSchema>
export type UserIdParams = z.infer<typeof UserIdParamsSchema>
export type GetAnswersQuery = z.infer<typeof GetAnswersQuerySchema>
export type QuizIdParams = z.infer<typeof QuizIdParamsSchema>
export type UserQuizParams = z.infer<typeof UserQuizParamsSchema>
export type QuizIdsRequest = z.infer<typeof QuizIdsRequestSchema>

