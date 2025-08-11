import 'reflect-metadata'
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import jwt from '@fastify/jwt' // @fastify/jwt 임포트
import * as admin from 'firebase-admin'
import { config } from '@/config/env'
import { connectDatabase, AppDataSource } from '@/config/database'
import { connectRedis } from '@/config/redis'
import { Quiz, User, Answer, Category, Report, UserBadge, Badge } from '@/entities'
import corsPlugin from '@/plugins/cors'
import swaggerPlugin from '@/plugins/swagger'
import zodPlugin from '@/plugins/zod'
import routes from '@/modules'
import RankingBatchService from '@/modules/Ranking/services/RankingBatchService';

// FastifyInstance에 authenticate 데코레이터 추가를 위한 타입 확장
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

// request.user에 JWT 토큰 payload 타입 정의
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: string;  // JWT 토큰에 저장되는 사용자 ID만 포함
    };
  }
}

// Firebase Admin SDK 초기화
if (!admin.apps.length) {
  if (config.firebaseProjectId && config.firebaseClientEmail && config.firebasePrivateKey) {
    // Prefer explicit env variables (e.g., Railway)
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebaseProjectId,
        clientEmail: config.firebaseClientEmail,
        privateKey: (config.firebasePrivateKey || '').replace(/\\n/g, '\n'),
      } as admin.ServiceAccount),
    });
  } else if (config.firebaseAdminSdkPath) {
    const serviceAccount = require(config.firebaseAdminSdkPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    throw new Error('Firebase credentials are not configured');
  }
}

// Set timezone for the application to UTC
process.env.TZ = 'UTC';

const fastify = Fastify({
  logger: true
})

// TypeORM repositories를 Fastify 인스턴스에 등록
const setupRepositories = async () => {
  fastify.decorate('orm', AppDataSource)
  fastify.decorate('repositories', {
    quiz: AppDataSource.getRepository(Quiz),
    user: AppDataSource.getRepository(User),
    answer: AppDataSource.getRepository(Answer),
    category: AppDataSource.getRepository(Category),
    report: AppDataSource.getRepository(Report),
    badge: AppDataSource.getRepository(Badge),
    userBadge: AppDataSource.getRepository(UserBadge),
  })
}

// 플러그인 등록
const setupPlugins = async () => {
  await fastify.register(corsPlugin)
  await fastify.register(swaggerPlugin)
  await fastify.register(zodPlugin)

  // JWT 플러그인 등록
  const resolvedJwtSecret: string = (() => {
    if (!config.jwtSecret) {
      if (config.nodeEnv === 'production') {
        throw new Error('JWT_SECRET is required in production environment')
      }
      fastify.log.warn('JWT_SECRET is not set; using a development fallback secret')
      return 'dev-secret'
    }
    return config.jwtSecret
  })()

  fastify.register(jwt, {
    secret: resolvedJwtSecret,
  })

  // authenticate 헬퍼 함수 추가
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      fastify.log.info('JWT 인증 시작', { 
        url: request.url, 
        authorization: request.headers.authorization ? 'Bearer ***' : 'None' 
      });
      
      await request.jwtVerify();
      
      fastify.log.info('JWT 인증 성공', { 
        url: request.url, 
        userId: request.user?.id 
      });
      return
    } catch (err) {
      fastify.log.error('JWT 인증 실패', { 
        url: request.url, 
        error: err 
      });
      reply.status(401).send({
        success: false,
        error: err,
      });
    }
  });

  // Global hook for authentication
  fastify.addHook('onRequest', async (request, reply) => {
    const publicRoutes = ['/api/auth/login', '/api/auth/google', '/api/auth/refresh', '/health', '/'];
    if (publicRoutes.includes(request.url) || request.url.startsWith('/docs')) {
      return;
    }
    try {
      await request.jwtVerify();
      return
    } catch (err) {
      reply.status(401).send({
        success: false,
        error: err,
      });
    }
  });
}

// 데이터베이스 및 Redis 연결
const setupConnections = async () => {
  try {
    await connectDatabase(fastify)
    // await connectRedis(fastify)
    await setupRepositories()
  } catch (error) {
    fastify.log.error('Failed to setup connections:', error)
    process.exit(1)
  }
}

// Routes
fastify.get('/', async (request, reply) => {
  return { hello: 'world', message: 'Fastify TypeScript Server with TypeORM, PostgreSQL and Redis' }
})

fastify.get('/health', async (request, reply) => {
  try {
    // PostgreSQL 연결 확인 (TypeORM)
    await fastify.orm.query('SELECT 1')
    
    // Redis 연결 확인
    await fastify.redis.ping()
    
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      services: {
        postgres: 'connected',
        redis: 'connected',
        typeorm: 'connected'
      }
    }
  } catch (error) {
    reply.status(503)
    return { 
      status: 'error', 
      timestamp: new Date().toISOString(),
      error: 'Service unavailable'
    }
  }
})

// TypeORM 테스트 엔드포인트
fastify.get('/test/typeorm', async (request, reply) => {
  try {
    const result = await fastify.orm.query('SELECT NOW() as current_time')
    reply.status(200).send({
      success: true,
      data: result[0],
    });
    return
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'TypeORM connection failed',
    });
    return
  }
})

// Entity 테스트 엔드포인트
fastify.get('/test/entities', async (request, reply) => {
  try {
    const quizCount = await fastify.repositories.quiz.count()
    const userCount = await fastify.repositories.user.count()
    const answerCount = await fastify.repositories.answer.count()
    const categoryCount = await fastify.repositories.category.count()
    
    return { 
      success: true, 
      data: { 
        counts: {
          quiz: quizCount,
          user: userCount,
          answer: answerCount,
          category: categoryCount
        }
      }
    }
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Entity test failed',
    });
    return
  }
})

// PostgreSQL 테스트 엔드포인트
fastify.get('/test/postgres', async (request, reply) => {
  try {
    const client = fastify.pg
    const result = await client.query('SELECT NOW() as current_time')
    reply.status(200).send({
      success: true,
      data: result.rows[0],
    });
    return
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'PostgreSQL connection failed',
    });
    return
  }
})

// Redis 테스트 엔드포인트
fastify.get('/test/redis', async (request, reply) => {
  try {
    const testKey = 'test_key'
    const testValue = 'test_value'
    
    await fastify.redis.set(testKey, testValue, 'EX', 60)
    const value = await fastify.redis.get(testKey)
    
    reply.status(200).send({
      success: true,
      data: { key: testKey, value },
    });
    return
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Redis connection failed',
    });
    return
  }
})

// API 라우트 등록
const setupRoutes = async () => {
  await fastify.register(routes, { prefix: '/api' })
}

const start = async () => {
  try {
    await setupPlugins()
    await setupConnections()

    const rankingBatchService = new RankingBatchService();
    rankingBatchService.start();
    // rankingBatchService.updateScores();
    await setupRoutes()
    await fastify.listen({ port: config.port, host: '0.0.0.0' })
    fastify.log.info(`Server is running on http://localhost:${config.port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()