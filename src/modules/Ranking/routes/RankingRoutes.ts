import { FastifyInstance } from 'fastify';
import { RankingController } from '../controllers/RankingController';
import { 
  DailyRankingQuerySchema, 
  WeeklyRankingQuerySchema, 
  MonthlyRankingQuerySchema,
  RankingResponseSchema,
  RankingListResponseSchema,
} from '../interfaces/Ranking';
import { z } from 'zod';

export default async function (fastify: FastifyInstance) {
  const rankingController = new RankingController();

  // 전체 랭킹 조회
  fastify.get('/weekly', {
    schema: {
      tags: ['Ranking'],
      description: '주간 랭킹을 조회합니다 (지난 주 완료된 기간 기준)',
      querystring: WeeklyRankingQuerySchema,
      response: {
        200: RankingListResponseSchema,
      },
    },
    handler: rankingController.getWeeklyRanking
  });

  fastify.get('/monthly', {
    schema: {
      tags: ['Ranking'],
      description: '월간 랭킹을 조회합니다 (지난 달 완료된 기간 기준)',
      querystring: MonthlyRankingQuerySchema,
      response: {
        200: RankingListResponseSchema,
      },
    },
    handler: rankingController.getMonthlyRanking
  });

  fastify.get('/daily', {
    schema: {
      tags: ['Ranking'],
      description: '일간 랭킹을 조회합니다 (전날 기준)',
      querystring: DailyRankingQuerySchema,
      response: {
        200: RankingListResponseSchema,
      },
    },
    handler: rankingController.getDailyRanking
  });

  // 개인 랭킹 조회
  fastify.get('/me/weekly', {
    preHandler: async (request, reply) => {
      await fastify.authenticate(request, reply);
    },
    schema: {
      tags: ['Ranking'],
      description: '나의 주간 랭킹을 조회합니다',
      querystring: WeeklyRankingQuerySchema,
      response: {
        200: RankingResponseSchema,
      },
    },
    handler: rankingController.getMyWeeklyRanking
  });

  fastify.get('/me/monthly', {
    preHandler: async (request, reply) => {
      await fastify.authenticate(request, reply);
    },
    schema: {
      tags: ['Ranking'],
      description: '나의 월간 랭킹을 조회합니다',
      querystring: MonthlyRankingQuerySchema,
      response: {
        200: RankingResponseSchema,
      },
    },
    handler: rankingController.getMyMonthlyRanking
  });

  fastify.get('/me/daily', {
    preHandler: async (request, reply) => {
      await fastify.authenticate(request, reply);
    },
    schema: {
      tags: ['Ranking'],
      description: '나의 일간 랭킹을 조회합니다',
      querystring: DailyRankingQuerySchema,
      response: {
        200: RankingResponseSchema,
      },
    },
    handler: rankingController.getMyDailyRanking
  });
}
