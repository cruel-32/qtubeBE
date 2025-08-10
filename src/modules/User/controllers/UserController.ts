import { FastifyRequest, FastifyReply } from 'fastify'
import { EntityManager } from 'typeorm'
import { User, Answer, RankingScore, UserBadge, Report } from '@/entities'
import {
  CreateUserRequest,
  UpdateUserRequest,
  FindOrCreateUserRequest,
  UserParams,
  EmailParams,
  PlatformParams,
} from '@/modules/User/interfaces/User'
import { convertNullToUndefined } from '@/utils/dbValueConverter'

export class UserController {
  static async createUser(
    request: FastifyRequest<{ Body: CreateUserRequest }>,
    reply: FastifyReply
  ) {
    try {
      const user = request.server.repositories.user.create(request.body)
      const savedUser = await request.server.repositories.user.save(user)
      
      reply.status(201).send({
        success: true,
        data: {
          ...savedUser,
          refreshToken: convertNullToUndefined(savedUser.refreshToken),
          picture: convertNullToUndefined(savedUser.picture),
          profile: convertNullToUndefined(savedUser.profile),
          introduction: convertNullToUndefined(savedUser.introduction),
          profileImage: convertNullToUndefined(savedUser.profileImage),
          fcmToken: convertNullToUndefined(savedUser.fcmToken),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to create user',
      })
    }
  }

  static async getAllUsers(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const users = await request.server.repositories.user.find()

      reply.status(200).send({
        success: true,
        data: users.map((user) => ({
          ...user,
          refreshToken: convertNullToUndefined(user.refreshToken),
          picture: convertNullToUndefined(user.picture),
          profile: convertNullToUndefined(user.profile),
          introduction: convertNullToUndefined(user.introduction),
          profileImage: convertNullToUndefined(user.profileImage),
          fcmToken: convertNullToUndefined(user.fcmToken),
        })),
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get users',
      })
    }
  }

  static async findOrCreateUser(
    request: FastifyRequest<{ Body: FindOrCreateUserRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { email } = request.body
      
      let user = await request.server.repositories.user.findOne({
        where: { email },
      })

      if (!user) {
        user = request.server.repositories.user.create(request.body)
        user = await request.server.repositories.user.save(user)
      }

      reply.status(200).send({
        success: true,
        data: {
          ...user,
          refreshToken: convertNullToUndefined(user.refreshToken),
          picture: convertNullToUndefined(user.picture),
          profile: convertNullToUndefined(user.profile),
          introduction: convertNullToUndefined(user.introduction),
          profileImage: convertNullToUndefined(user.profileImage),
          fcmToken: convertNullToUndefined(user.fcmToken),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to find or create user',
      })
    }
  }

  

  static async getUsersByPlatform(
    request: FastifyRequest<{ Params: PlatformParams }>,
    reply: FastifyReply
  ) {
    try {
      const { platform } = request.params
      
      const users = await request.server.repositories.user.find({
        where: { platform },
      })

      reply.status(200).send({
        success: true,
        data: users.map((user) => ({
          ...user,
          refreshToken: convertNullToUndefined(user.refreshToken),
          picture: convertNullToUndefined(user.picture),
          profile: convertNullToUndefined(user.profile),
          introduction: convertNullToUndefined(user.introduction),
          profileImage: convertNullToUndefined(user.profileImage),
          fcmToken: convertNullToUndefined(user.fcmToken),
        })),
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get users by platform',
      })
    }
  }

  static async getUserByEmail(
    request: FastifyRequest<{ Params: EmailParams }>,
    reply: FastifyReply
  ) {
    try {
      const { email } = request.params
      
      const user = await request.server.repositories.user.findOne({
        where: { email },
        relations: ['answers'],
      })

      if (!user) {
        reply.status(404).send({
          success: false,
          error: 'User not found',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: {
          ...user,
          refreshToken: convertNullToUndefined(user.refreshToken),
          picture: convertNullToUndefined(user.picture),
          profile: convertNullToUndefined(user.profile),
          introduction: convertNullToUndefined(user.introduction),
          profileImage: convertNullToUndefined(user.profileImage),
          fcmToken: convertNullToUndefined(user.fcmToken),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get user by email',
      })
    }
  }

  static async getUserById(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const user = await request.server.repositories.user.findOne({
        where: { id },
        relations: ['answers'],
      })

      if (!user) {
        reply.status(404).send({
          success: false,
          error: 'User not found',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: {
          ...user,
          refreshToken: convertNullToUndefined(user.refreshToken),
          picture: convertNullToUndefined(user.picture),
          profile: convertNullToUndefined(user.profile),
          introduction: convertNullToUndefined(user.introduction),
          profileImage: convertNullToUndefined(user.profileImage),
          fcmToken: convertNullToUndefined(user.fcmToken),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get user',
      })
    }
  }

  static async getUserStats(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const user = await request.server.repositories.user.findOne({
        where: { id },
      })

      if (!user) {
        reply.status(404).send({
          success: false,
          error: 'User not found',
        })
        return
      }

      const totalAnswers = await request.server.repositories.answer.count({
        where: { userId: id },
      })

      const correctAnswers = await request.server.repositories.answer.count({
        where: { userId: id, isCorrect: true },
      })

      const wrongAnswers = totalAnswers - correctAnswers
      const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0

      reply.status(200).send({
        success: true,
        data: {
          ...user,
          refreshToken: convertNullToUndefined(user.refreshToken),
          picture: convertNullToUndefined(user.picture),
          profile: convertNullToUndefined(user.profile),
          introduction: convertNullToUndefined(user.introduction),
          profileImage: convertNullToUndefined(user.profileImage),
          fcmToken: convertNullToUndefined(user.fcmToken),
          stats: {
            totalAnswers,
            correctAnswers,
            wrongAnswers,
            accuracy: Math.round(accuracy * 100),
          },
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

  static async updateUser(
    request: FastifyRequest<{ Params: UserParams; Body: UpdateUserRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const jwtUser = request.user;

      // 본인 계정만 수정 가능하도록 체크
      if (!jwtUser || jwtUser.id !== id) {
        reply.status(403).send({
          success: false,
          error: 'Forbidden: You can only update your own account.',
        });
        return;
      }
      
      const user = await request.server.repositories.user.findOne({
        where: { id },
      });

      if (!user) {
        reply.status(404).send({
          success: false,
          error: 'User not found',
        });
        return;
      }

      // email, name, platform 필드는 수정할 수 없도록 제거
      const updateData: UpdateUserRequest = { ...request.body };
      delete updateData.email;
      delete updateData.name;
      delete updateData.platform;

      await request.server.repositories.user.update(id, updateData);
      
      const updatedUser = await request.server.repositories.user.findOne({
        where: { id },
      });

      if (!updatedUser) {
        reply.status(404).send({
          success: false,
          error: 'User not found',
        });
        return;
      }
      reply.status(200).send({
        success: true,
        data: {
          ...updatedUser,
          refreshToken: convertNullToUndefined(updatedUser.refreshToken),
          picture: convertNullToUndefined(updatedUser.picture),
          profile: convertNullToUndefined(updatedUser.profile),
          introduction: convertNullToUndefined(updatedUser.introduction),
          profileImage: convertNullToUndefined(updatedUser.profileImage),
        },
      });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        error: 'Failed to update user',
      });
    }
  }

  static async deleteUser(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const jwtUser = request.user;
  
      // 본인 계정만 삭제 가능하도록 체크
      if (!jwtUser || jwtUser.id !== id) {
        reply.status(403).send({
          success: false,
          error: 'Forbidden: You can only delete your own account.',
        });
        return;
      }
  
      const user = await request.server.repositories.user.findOne({
        where: { id },
      });
  
      if (!user) {
        reply.status(404).send({
          success: false,
          error: 'User not found',
        });
        return;
      }
  
      // 트랜잭션 시작
      await request.server.orm.transaction(async (transactionalEntityManager: EntityManager) => {
        // 사용자의 퀴즈 응답 삭제
        await transactionalEntityManager
          .getRepository(Answer)
          .delete({ userId: id });
  
        
  
        // 사용자의 랭킹 점수 삭제
        await transactionalEntityManager
          .getRepository(RankingScore)
          .delete({ user: { id: id } });
  
        // 사용자의 뱃지 삭제
        await transactionalEntityManager
          .getRepository(UserBadge)
          .delete({ userId: id });
  
        // 사용자의 신고 기록 삭제
        await transactionalEntityManager
          .getRepository(Report)
          .delete({ userId: id });
  
        // 마지막으로 사용자 삭제
        await transactionalEntityManager
          .getRepository(User)
          .remove(user);
      });
  
      reply.status(200).send({
        success: true,
        data: { message: 'User and all related data deleted successfully' },
      });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        error: 'Failed to delete user and related data',
      });
    }
  }

  static async getCurrentUser(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      request.log.info('getCurrentUser 시작');
      
      // JWT 토큰에서 추출된 사용자 ID 가져오기
      const jwtUser = request.user; 
      request.log.info('JWT 사용자 정보:', jwtUser);

      if (!jwtUser || !jwtUser.id) {
        request.log.error('JWT 사용자 정보 없음 또는 ID 누락');
        reply.status(401).send({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      request.log.info('데이터베이스에서 사용자 조회 시작:', jwtUser.id);
      // OdVK4yfmEMU0Oo7YOnTKHQMwbNG2
      // 데이터베이스에서 실제 사용자 정보 조회
      const user = await request.server.repositories.user.findOne({
        where: { id: jwtUser.id },
      });

      request.log.info('데이터베이스 조회 결과:', user ? '사용자 찾음' : '사용자 없음');

      if (!user) {
        request.log.error('사용자를 찾을 수 없음:', jwtUser.id);
        reply.status(404).send({
          success: false,
          error: 'User not found',
        });
        return;
      }

      request.log.info('getCurrentUser 성공');
      request.log.info(user);
      request.log.info('getCurrentUser 성공 파라미터');
      request.log.info(jwtUser.id);
      reply.status(200).send({
        success: true,
        data: {
          ...user,
          refreshToken: convertNullToUndefined(user.refreshToken),
          picture: convertNullToUndefined(user.picture),
          profile: convertNullToUndefined(user.profile),
          introduction: convertNullToUndefined(user.introduction),
          profileImage: convertNullToUndefined(user.profileImage),
          fcmToken: convertNullToUndefined(user.fcmToken),
        },
      });
    } catch (error) {
      request.log.error('Get current user failed:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to get current user',
        details: (error as Error).message,
      });
    }
  }

  static async updateFcmToken(
    request: FastifyRequest<{ Body: { fcmToken: string } }>,
    reply: FastifyReply
  ) {
    try {
      console.log('updateFcmToken 시작 :::::::::::: ');
      const userId = request.user.id;
      const { fcmToken } = request.body;
      
      await request.server.repositories.user.update(userId, { fcmToken });
      console.log('userId :::::::::::: ', userId);
      reply.status(200).send({
        success: true,
        data: {
          fcmToken
        },
      });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        error: 'Failed to update fcm token',
      });
    }
  }

  static async updateNotificationSettings(
    request: FastifyRequest<{ Body: { pushNotificationsEnabled: boolean } }>,
    reply: FastifyReply
  ) {
    try {
      console.log('updateNotificationSettings 시작 ::::::::::::');
      const userId = request.user.id;
      const { pushNotificationsEnabled } = request.body;

      await request.server.repositories.user.update(userId, { pushNotificationsEnabled });
      console.log('userId :::::::::::: ', userId);
      reply.status(200).send({
        success: true,
        data: {
          pushNotificationsEnabled
        },
      });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        error: 'Failed to update notification settings',
      });
    }
  }
}