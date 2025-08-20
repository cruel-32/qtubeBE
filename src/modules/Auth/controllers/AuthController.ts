import { FastifyRequest, FastifyReply } from 'fastify'
import * as admin from 'firebase-admin'
import { Platform } from '@/entities/User'
import {
  GoogleLoginRequest,
  RefreshTokenRequest,
  LogoutRequest,
  AuthResponse,
  TestLoginRequest,
} from '@/modules/Auth/interfaces/Auth'
import { config } from '@/config/env' // config 임포트 추가
import axios from 'axios';

const ACCESS_TOKEN_EXPIRES_IN = '15m' // 15분
const REFRESH_TOKEN_EXPIRES_IN = '7d' // 7일

export class AuthController {
  static async googleLogin(
    request: FastifyRequest<{ Body: GoogleLoginRequest }>,
    reply: FastifyReply
  ) {
    try {
      request.log.info('Google login 시작');
      const { idToken } = request.body;
      
      if (!idToken) {
        request.log.error('ID Token이 없음');
        reply.status(400).send({
          success: false,
          error: 'ID 토큰이 필요합니다.',
        });
        return;
      }
      
      request.log.info('Firebase ID 토큰 검증 시작');
      // Firebase ID 토큰 검증
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      request.log.info('Firebase ID 토큰 검증 성공', { uid: decodedToken.uid });
      
      const firebaseUid = decodedToken.uid;
      const email = decodedToken.email;
      const name = decodedToken.name || email;
      const picture = decodedToken?.picture;

      // Firebase UID로 사용자 조회 (id 또는 profile 필드에서)
      let user = await request.server.repositories.user.findOne({
        where: [
          { id: firebaseUid, platform: Platform.GOOGLE },
          { profile: firebaseUid, platform: Platform.GOOGLE }
        ],
      });

      if (!user) {
        // 새 사용자 생성
        user = request.server.repositories.user.create({
          id: firebaseUid, // Firebase UID를 id로 사용
          email: email || undefined,
          name: name || undefined,
          nickName: name || undefined, // 초기 닉네임은 이름과 동일하게 설정
          picture: picture || undefined,
          platform: Platform.GOOGLE,
          profile: firebaseUid, // Firebase UID를 profile 필드에 저장
        });
        user = await request.server.repositories.user.save(user);
      } else {
        // 기존 사용자 정보 업데이트 (선택 사항)
        if (email) {
          user.email = email;
        }
        if (name) {
          user.name = name;
        }
        if (picture !== undefined) {
          user.picture = picture;
        }
        user = await request.server.repositories.user.save(user);
      }

      // JWT 토큰 생성 (타입 정의와 일치하도록 id 사용)
      request.log.info('JWT 토큰 생성 시작');
      const accessToken = await reply.jwtSign(
        { id: user.id },
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );
      const refreshToken = await reply.jwtSign(
        { id: user.id },
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );
      request.log.info('JWT 토큰 생성 완료');

      // DB에 refreshToken 저장
      user.refreshToken = refreshToken; // tokens.refreshToken 대신 직접 refreshToken 사용
      await request.server.repositories.user.save(user);
      request.log.info('refreshToken 저장 완료');

      const authResponse: AuthResponse = {
        accessToken: accessToken, // tokens.accessToken 대신 직접 accessToken 사용
        refreshToken: refreshToken, // tokens.refreshToken 대신 직접 refreshToken 사용
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          nickName: user.nickName,
          picture: user.picture,
          platform: user.platform,
        },
      };

      request.log.info('Google login 성공 응답 전송');
      reply.status(200).send({
        success: true,
        data: authResponse,
      });
    } catch (error: unknown) {
      request.log.error('Google login failed:', error);
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        if (firebaseError.code === 'auth/id-token-expired' || firebaseError.code === 'auth/invalid-id-token') {
          reply.status(401).send({
            success: false,
            error: '유효하지 않은 ID 토큰입니다.',
            details: firebaseError.message,
          });
          return;
        }
      }
      
      reply.status(500).send({
        success: false,
        error: '구글 로그인에 실패했습니다.',
        details: (error instanceof Error) ? error.message : String(error),
      });
    }
  }

  static async refresh(
    request: FastifyRequest<{ Body: RefreshTokenRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { refreshToken } = request.body;

      if (!refreshToken) {
        reply.status(400).send({
          success: false,
          error: '리프레시 토큰이 필요합니다.',
        });
        return;
      }

      // 리프레시 토큰 검증
      let decoded: { id: string };
      try {
        // 임시로 Authorization 헤더에 refreshToken 설정
        const originalAuth = request.headers.authorization;
        request.headers.authorization = `Bearer ${refreshToken}`;
        decoded = await request.jwtVerify() as { id: string };
        request.headers.authorization = originalAuth;
      } catch (err) {
        reply.status(401).send({
          success: false,
          error: '유효하지 않은 리프레시 토큰입니다.',
          code: 'REFRESH_TOKEN_INVALID',
        });
        return;
      }
      
      // 사용자 존재 확인 및 DB에 저장된 refreshToken과 비교
      const user = await request.server.repositories.user.findOne({
        where: { id: decoded.id },
      });

      if (!user) {
        reply.status(401).send({
          success: false,
          error: '사용자를 찾을 수 없습니다.',
        });
        return;
      }

      // DB에 저장된 refreshToken과 요청으로 받은 refreshToken 비교
      if (!user.refreshToken || user.refreshToken !== refreshToken) {
        reply.status(401).send({
          success: false,
          error: '유효하지 않은 리프레시 토큰입니다.',
          code: 'REFRESH_TOKEN_INVALID', // FE에서 로그아웃 처리용 코드
        });
        return;
      }

      // 새 토큰 생성
      const newAccessToken = await reply.jwtSign(
        { id: user.id },
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );
      const newRefreshToken = await reply.jwtSign(
        { id: user.id },
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );

      // DB에 새로운 refreshToken 저장
      user.refreshToken = newRefreshToken; // tokens.refreshToken 대신 직접 newRefreshToken 사용
      await request.server.repositories.user.save(user);

      reply.status(200).send({
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error: unknown) {
      request.log.error('토큰 갱신 실패:', error);
      reply.status(401).send({
        success: false,
        error: '유효하지 않은 리프레시 토큰입니다.',
      });
    }
  }

  static async logout(
    request: FastifyRequest<{ Body: LogoutRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { refreshToken } = request.body;

      if (refreshToken) {
        try {
          // 리프레시 토큰 검증
          const originalAuth = request.headers.authorization;
          request.headers.authorization = `Bearer ${refreshToken}`;
          const decoded = await request.jwtVerify() as { id: string };
          request.headers.authorization = originalAuth;
          
          // 사용자 찾기
          const user = await request.server.repositories.user.findOne({
            where: { id: decoded.id },
          });

          if (user && user.refreshToken === refreshToken) {
            // DB에서 refreshToken 삭제 (무효화)
            user.refreshToken = undefined as any;
            await request.server.repositories.user.save(user);
            request.log.info(`RefreshToken invalidated for user: ${user.id}`);
          }
        } catch (tokenError) {
          // 토큰이 유효하지 않더라도 로그아웃은 성공으로 처리
          request.log.warn('Invalid refresh token during logout:', tokenError);
        }
      }

      reply.status(200).send({
        success: true,
        data: { message: '로그아웃 성공' },
      });
    } catch (error: unknown) {
      request.log.error('로그아웃 실패:', error);
      reply.status(500).send({
        success: false,
        error: '로그아웃에 실패했습니다.',
      });
    }
  }

  static async testLogin(
    request: FastifyRequest<{ Body: TestLoginRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.body;

      let user = await request.server.repositories.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        // 사용자가 없으면 새로 생성 (임시 데이터)
        user = request.server.repositories.user.create({
          id: userId,
          email: `${userId}@test.com`,
          name: `Test User ${userId}`,
          nickName: `TestUser${userId}`,
          platform: Platform.GOOGLE, // 임시로 Google 플랫폼으로 설정
        });
        user = await request.server.repositories.user.save(user);
      }

      const accessToken = await reply.jwtSign(
        { id: user.id },
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );
      const refreshToken = await reply.jwtSign(
        { id: user.id },
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );

      user.refreshToken = refreshToken;
      await request.server.repositories.user.save(user);

      const authResponse: AuthResponse = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          nickName: user.nickName,
          picture: user.picture,
          platform: user.platform,
        },
      };

      reply.status(200).send({
        success: true,
        data: authResponse,
      });
    } catch (error: unknown) {
      request.log.error('Test login failed:', error);
      reply.status(500).send({
        success: false,
        error: 'Test login failed',
        details: (error instanceof Error) ? error.message : String(error),
      });
    }
  }
}