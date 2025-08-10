import { FastifyInstance } from 'fastify';
import { AuthController } from '@/modules/Auth/controllers/AuthController';
import { TestLoginSchema } from '@/modules/Auth/interfaces/Auth';
import { config } from '@/config/env';

async function authRoutes(fastify: FastifyInstance) {
  // Google 로그인
  fastify.post('/google', AuthController.googleLogin);

  // Kakao 로그인
  fastify.post('/kakao', AuthController.kakaoLogin);
  
  // 개발 환경에서만 사용 가능한 테스트 로그인
  if (config.nodeEnv === 'development') {
    fastify.post('/test-login', {
      schema: {
        body: TestLoginSchema,
        tags: ['Auth'],
        description: '개발 환경에서 테스트용으로 로그인 토큰을 발급합니다.',
      },
      handler: AuthController.testLogin,
    });
  }

  // 토큰 갱신
  fastify.post('/refresh', AuthController.refresh);
  
  // 로그아웃
  fastify.post('/logout', AuthController.logout);
}

export default authRoutes;