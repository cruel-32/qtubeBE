import { z } from 'zod'
import { Platform } from '@/entities/User'

export const CreateUserSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다'),
  nickName: z.string().min(1, '닉네임은 필수입니다'),
  picture: z.string().optional(),
  platform: z.nativeEnum(Platform),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  profile: z.string().optional(),
  introduction: z.string().optional(),
  profileImage: z.string().optional(),
})

export const UpdateUserSchema = CreateUserSchema.partial()

export const FindOrCreateUserSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  name: z.string().min(1, '이름은 필수입니다'),
  nickName: z.string().min(1, '닉네임은 필수입니다'),
  picture: z.string().optional(),
  platform: z.nativeEnum(Platform),
  profile: z.string().optional(),
  introduction: z.string().optional(),
  profileImage: z.string().optional(),
})



export const UserParamsSchema = z.object({
  id: z.string()
})

export const EmailParamsSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
})

export const PlatformParamsSchema = z.object({
  platform: z.nativeEnum(Platform),
})

export const UserDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  nickName: z.string(),
  picture: z.string().optional(),
  platform: z.nativeEnum(Platform),
  email: z.string().email(),
  profile: z.string().optional(),
  introduction: z.string().optional(),
  profileImage: z.string().optional(),
  fcmToken: z.string().optional(),
  pushNotificationsEnabled: z.boolean(),
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
})

export type CreateUserRequest = z.infer<typeof CreateUserSchema>
export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>
export type FindOrCreateUserRequest = z.infer<typeof FindOrCreateUserSchema>
export type UserParams = z.infer<typeof UserParamsSchema>
export type EmailParams = z.infer<typeof EmailParamsSchema>
export type PlatformParams = z.infer<typeof PlatformParamsSchema>
export type UserDetails = z.infer<typeof UserDetailsSchema>



// Response 스키마들 추가
export const UserResponseSchema = z.object({
  success: z.boolean(),
  data: UserDetailsSchema.optional(),
  message: z.string().optional(),
})

export const UsersResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(UserDetailsSchema),
  message: z.string().optional(),
})

export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
})



export const UserStatsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    totalQuizzes: z.number(),
    correctAnswers: z.number(),
    accuracy: z.number(),
  }),
  message: z.string().optional(),
})

