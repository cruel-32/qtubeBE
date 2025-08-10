import { FastifyInstance } from 'fastify'
import { UserController } from '@/modules/User/controllers/UserController'
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserDetailsSchema,
  UserParamsSchema,
  EmailParamsSchema,
  PlatformParamsSchema,
  FindOrCreateUserSchema,
  UserResponseSchema,
  UsersResponseSchema,
  ErrorResponseSchema,
  UserStatsResponseSchema,
} from '@/modules/User/interfaces/User'
import { z } from 'zod'

const userRoutes = async (fastify: FastifyInstance) => {
  // 전체 사용자 조회
  fastify.get('/', {
    schema: {
      tags: ['User'],
      description: '모든 사용자를 조회합니다',
      response: {
        200: UsersResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.getAllUsers,
  })

  // 사용자 생성
  fastify.post('/', {
    schema: {
      body: CreateUserSchema,
      tags: ['User'],
      description: '새로운 사용자를 생성합니다',
      response: {
        201: UserResponseSchema,
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.createUser,
  })

  // 현재 로그인된 사용자 정보 조회 (/:id 보다 먼저 정의해야 함)
  fastify.get('/me', {
    preHandler: async (request, reply) => {
      fastify.log.info('/me 엔드포인트 접근');
      await fastify.authenticate(request, reply);
    },
    schema: {
      tags: ['User'],
      description: '현재 로그인된 사용자 정보를 조회합니다.',
      response: {
        200: UserResponseSchema,
        401: ErrorResponseSchema,
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.getCurrentUser,
  })

  // 사용자 상세 조회
  fastify.get('/:id', {
    schema: {
      params: UserParamsSchema,
      tags: ['User'],
      description: '특정 사용자의 상세 정보를 조회합니다',
      response: {
        200: UserResponseSchema,
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.getUserById,
  })

  // 사용자 업데이트
  fastify.put('/:id', {
    schema: {
      params: UserParamsSchema,
      body: UpdateUserSchema,
      tags: ['User'],
      description: '사용자 정보를 업데이트합니다',
      response: {
        200: UserResponseSchema,
        400: ErrorResponseSchema,
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.updateUser,
  })

  // 사용자 삭제
  fastify.delete('/:id', {
    schema: {
      params: UserParamsSchema,
      tags: ['User'],
      description: '사용자를 삭제합니다',
      response: {
        200: UserResponseSchema,
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.deleteUser,
  })

  // 이메일로 사용자 조회
  fastify.get('/email/:email', {
    schema: {
      params: EmailParamsSchema,
      tags: ['User'],
      description: '이메일로 사용자를 조회합니다',
      response: {
        200: UserResponseSchema,
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.getUserByEmail,
  })

  // 플랫폼별 사용자 조회
  fastify.get('/platform/:platform', {
    schema: {
      params: PlatformParamsSchema,
      tags: ['User'],
      description: '특정 플랫폼의 사용자들을 조회합니다',
      response: {
        200: UsersResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.getUsersByPlatform,
  })

  // 사용자 찾기 또는 생성
  fastify.post('/find-or-create', {
    schema: {
      body: FindOrCreateUserSchema,
      tags: ['User'],
      description: '사용자를 찾거나 없으면 새로 생성합니다',
      response: {
        200: UserResponseSchema,
        201: UserResponseSchema,
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.findOrCreateUser,
  })



  // 사용자 통계 조회
  fastify.get('/:id/stats', {
    schema: {
      params: UserParamsSchema,
      tags: ['User'],
      description: '사용자의 퀴즈 통계를 조회합니다',
      response: {
        200: UserStatsResponseSchema,
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.getUserStats,
  })

  fastify.put('/me/fcm-token', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['User'],
      description: 'FCM 토큰을 업데이트합니다.',
      body: UserDetailsSchema.pick({ fcmToken: true }).required(),
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            fcmToken: z.string(),
          }),
        }),
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.updateFcmToken,
  });

  fastify.put('/me/notification-settings', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['User'],
      description: '푸시 알림 설정을 업데이트합니다.',
      body: UserDetailsSchema.pick({
        pushNotificationsEnabled: true
      }),
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            pushNotificationsEnabled: z.boolean(),
          }),
        }),
        500: ErrorResponseSchema,
      },
    },
    handler: UserController.updateNotificationSettings,
  });
}

export default userRoutes