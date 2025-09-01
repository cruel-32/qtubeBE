import { FastifyRequest, FastifyReply } from 'fastify';
import { format, subDays, subWeeks, subMonths, getISOWeek, getISOWeekYear } from 'date-fns';
import { AppDataSource } from '@/config/database';
import { RankingScore, RankingType } from '@/entities/RankingScore';
import { MoreThan } from 'typeorm';
import { Ranking, DailyRankingQuery, WeeklyRankingQuery, MonthlyRankingQuery } from '../interfaces/Ranking';
import { convertNullToUndefined } from '@/utils/dbValueConverter';
import { Badge } from '@/entities/Badge';

// Helper function to get equipped badges
function getEquippedBadgesFromUser(user: any): Badge[] {
  if (!user.equippedBadgeIds || user.equippedBadgeIds.length === 0 || !user.userBadges) {
    return [];
  }
  const equippedBadgeObjects: Badge[] = [];
  for (const badgeId of user.equippedBadgeIds) {
    const userBadge = user.userBadges.find((ub: any) => ub.badgeId === badgeId);
    if (userBadge && userBadge.badge) {
      equippedBadgeObjects.push(userBadge.badge);
    }
  }
  return equippedBadgeObjects;
}

export class RankingController {
  // 주간 랭킹 조회 (ISO 8601 기준)
  async getWeeklyRanking(request: FastifyRequest<{ Querystring: WeeklyRankingQuery }>, reply: FastifyReply) {
    try {
      const { wYear, week, current } = request.query;
      let targetDate = new Date();

      if (wYear && week) {
        // 특정 년도/주차 지정
        const tempDate = new Date(wYear, 0, 4); // 1월 4일을 기준으로 ISO 주차 계산
        const firstWeekStart = subDays(tempDate, tempDate.getDay() - 1); // 월요일로 조정
        targetDate = new Date(firstWeekStart.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
      } else if (current === 'true') {
        // 현재 주 (어제가 포함된 주)
        const yesterday = subDays(new Date(), 1);
        targetDate = yesterday;
      } else {
        // 기본값: 현재 주 (어제가 포함된 주)
        const yesterday = subDays(new Date(), 1);
        targetDate = yesterday;
      }

      // ISO 8601 기준으로 주차 포맷 생성
      const isoYear = getISOWeekYear(targetDate);
      const isoWeek = getISOWeek(targetDate);
      const weeklyPeriod = `${isoYear}-W${isoWeek.toString().padStart(2, '0')}`;

      console.log('Weekly period calculation:', {
        targetDate: targetDate.toISOString(),
        isoYear,
        isoWeek,
        weeklyPeriod,
        current: current === 'true'
      });

      const rankingRepo = AppDataSource.getRepository(RankingScore);

      const rankings = await rankingRepo.find({
        where: {
          rankingType: RankingType.WEEKLY,
          period: weeklyPeriod,
        },
        order: {
          score: 'DESC',
        },
        take: 100,
        relations: ['user', 'user.userBadges', 'user.userBadges.badge'],
      });

      console.log('weekly rankings :::::::: ', rankings)


      const response: Ranking[] = rankings.map((r, index) => ({
        rank: index + 1,
        user: {
          id: r.user.id,
          nickName: convertNullToUndefined(r.user.nickName),
          picture: convertNullToUndefined(r.user.picture),
          userBadges: r.user.userBadges?.map(userBadge => ({
            id: userBadge.id,
            badge: {
              ...userBadge.badge,
              createdAt: userBadge.badge.createdAt.toISOString(),
              updatedAt: userBadge.badge.updatedAt.toISOString(),
            },
            createdAt: userBadge.createdAt.toISOString(),
          })) || [],
          equippedBadgeIds: r.user.equippedBadgeIds || [],
        },
        score: r.score,
        totalAttempts: r.totalAttempts,
        correctAnswers: r.correctAnswers,
        accuracy: r.totalAttempts > 0 ? Math.round((r.correctAnswers / r.totalAttempts) * 100) : 0,
      }));

      console.log('weekly response :::::::: ', response)

      return reply.status(200).send({ 
        success: true, 
        data: response,
        period: {
          type: 'weekly',
          value: weeklyPeriod,
          displayName: `${isoYear}년 ${isoWeek}주차`,
          year: isoYear,
          week: isoWeek
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get weekly ranking',
      });
    }
  }

  // 월간 랭킹 조회
  async getMonthlyRanking(request: FastifyRequest<{ Querystring: MonthlyRankingQuery }>, reply: FastifyReply) {
    try {
      const { mYear, month, current } = request.query;
      console.log('=== MONTHLY RANKING EMERGENCY DEBUG ===');
      console.log('mYear :::::::: ', mYear)
      console.log('month :::::::: ', month)
      console.log('current :::::::: ', current)
      
      let targetDate = new Date();
      const now = new Date();
      const yesterday = subDays(now, 1);
      
      console.log('Current time (server):', now.toISOString());
      console.log('Yesterday (server):', yesterday.toISOString());
      console.log('Current time (KST):', new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString());
      console.log('Yesterday (KST):', new Date(yesterday.getTime() + 9 * 60 * 60 * 1000).toISOString());
      
      // 강제로 현재 시간 확인
      console.log('Real current month:', format(now, 'yyyy-MM'));
      console.log('Real yesterday month:', format(yesterday, 'yyyy-MM'));

      if (mYear && month) {
        targetDate = new Date(mYear, month - 1, 1); // 월은 0부터 시작
        console.log('Using specific year/month:', targetDate.toISOString());
      } else if (current === 'true') {
        // 현재 월 (어제가 포함된 월)
        targetDate = yesterday;
        console.log('Using current month (yesterday-based):', targetDate.toISOString());
      } else {
        // 기본값: 현재 월 (어제가 포함된 월) - FORCE THIS PATH
        targetDate = yesterday;
        console.log('🔥 USING CURRENT MONTH AS DEFAULT (YESTERDAY-BASED):', targetDate.toISOString());
        console.log('🔥 THIS SHOULD BE JULY IF YESTERDAY IS 2025-07-27');
      }
      
      const monthlyPeriod = format(targetDate, 'yyyy-MM');

      console.log('🚨 FINAL MONTHLY PERIOD:', monthlyPeriod);
      console.log('🚨 IF YESTERDAY WAS 2025-07-27, THIS SHOULD BE 2025-07');

      console.log('Monthly period calculation:', {
        targetDate: targetDate.toISOString(),
        monthlyPeriod,
        current: current === 'true',
        actualYesterday: format(yesterday, 'yyyy-MM-dd'),
        shouldBePeriod: format(yesterday, 'yyyy-MM')
      });

      const rankingRepo = AppDataSource.getRepository(RankingScore);

      console.log('Querying with period:', monthlyPeriod);

      // 먼저 모든 월간 period 확인
      const allMonthlyPeriods = await rankingRepo
        .createQueryBuilder('ranking')
        .select('DISTINCT ranking.period', 'period')
        .where('ranking.rankingType = :type', { type: RankingType.MONTHLY })
        .orderBy('ranking.period', 'DESC')
        .getRawMany();
      
      console.log('🔍 All available monthly periods in DB:', allMonthlyPeriods.map(p => p.period));

      const rankings = await rankingRepo.find({
        where: {
          rankingType: RankingType.MONTHLY,
          period: monthlyPeriod,
        },
        order: {
          score: 'DESC',
        },
        take: 100,
        relations: ['user', 'user.userBadges', 'user.userBadges.badge'],
      });

      console.log('Found rankings count:', rankings.length);
      console.log('monthly rankings :::::::: ', rankings)

      const response: Ranking[] = rankings.map((r, index) => ({
        rank: index + 1,
        user: {
          id: r.user.id,
          nickName: convertNullToUndefined(r.user.nickName),
          picture: convertNullToUndefined(r.user.picture),
          userBadges: r.user.userBadges?.map(userBadge => ({
            id: userBadge.id,
            badge: {
              ...userBadge.badge,
              createdAt: userBadge.badge.createdAt.toISOString(),
              updatedAt: userBadge.badge.updatedAt.toISOString(),
            },
            createdAt: userBadge.createdAt.toISOString(),
          })) || [],
          equippedBadgeIds: r.user.equippedBadgeIds || [],
        },
        score: r.score,
        totalAttempts: r.totalAttempts,
        correctAnswers: r.correctAnswers,
        accuracy: r.totalAttempts > 0 ? Math.round((r.correctAnswers / r.totalAttempts) * 100) : 0,
      }));

      console.log('🎯 FINAL RESPONSE COUNT:', response.length);
      console.log('monthly response :::::::: ', response)

      return reply.status(200).send({ 
        success: true, 
        data: response,
        period: {
          type: 'monthly',
          value: monthlyPeriod,
          displayName: format(targetDate, 'yyyy년 MM월'),
          year: targetDate.getFullYear(),
          month: targetDate.getMonth() + 1
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get monthly ranking',
      });
    }
  }

  // 일간 랭킹 조회 (전날)
  async getDailyRanking(request: FastifyRequest<{ Querystring: DailyRankingQuery }>, reply: FastifyReply) {
    try {
      const { date } = request.query;
      let targetDate = new Date();

      if (date) {
        targetDate = new Date(date); // YYYY-MM-DD 형식의 문자열을 Date 객체로 변환
      } else {
        targetDate = subDays(targetDate, 1); // 기본값: 어제
      }
      const dailyPeriod = format(targetDate, 'yyyy-MM-dd');
      const rankingRepo = AppDataSource.getRepository(RankingScore);

      const rankings = await rankingRepo.find({
        where: {
          rankingType: RankingType.DAILY,
          period: dailyPeriod,
        },
        order: {
          score: 'DESC',
          correctAnswers: 'DESC',
        },
        take: 100,
        relations: ['user', 'user.userBadges', 'user.userBadges.badge'],
      });

      const response: Ranking[] = rankings.map((r, index) => ({
        rank: index + 1,
        user: {
          id: r.user.id,
          nickName: convertNullToUndefined(r.user.nickName),
          picture: convertNullToUndefined(r.user.picture),
          userBadges: r.user.userBadges?.map(userBadge => ({
            id: userBadge.id,
            badge: {
              ...userBadge.badge,
              createdAt: userBadge.badge.createdAt.toISOString(),
              updatedAt: userBadge.badge.updatedAt.toISOString(),
            },
            createdAt: userBadge.createdAt.toISOString(),
          })) || [],
          equippedBadgeIds: r.user.equippedBadgeIds || [],
        },
        score: r.score,
        totalAttempts: r.totalAttempts,
        correctAnswers: r.correctAnswers,
        accuracy: r.totalAttempts > 0 ? Math.round((r.correctAnswers / r.totalAttempts) * 100) : 0,
      }));

      console.log('daily response :::::::: ', response)

      return reply.status(200).send({ 
        success: true, 
        data: response,
        period: {
          type: 'daily',
          value: dailyPeriod,
          displayName: format(targetDate, 'yyyy년 MM월 dd일'),
          year: targetDate.getFullYear(),
          month: targetDate.getMonth() + 1,
          day: targetDate.getDate()
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get daily ranking',
      });
    }
  }

  // 나의 주간 랭킹 조회 (ISO 8601 기준)
  async getMyWeeklyRanking(request: FastifyRequest<{ Querystring: WeeklyRankingQuery }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'User not authenticated',
        });
      }

      const { wYear, week, current } = request.query;
      let targetDate = new Date();

      if (wYear && week) {
        // 특정 년도/주차 지정
        const tempDate = new Date(wYear, 0, 4); // 1월 4일을 기준으로 ISO 주차 계산
        const firstWeekStart = subDays(tempDate, tempDate.getDay() - 1); // 월요일로 조정
        targetDate = new Date(firstWeekStart.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
      } else if (current === 'true') {
        // 현재 주 (어제가 포함된 주)
        const yesterday = subDays(new Date(), 1);
        targetDate = yesterday;
      } else {
        // 기본값: 현재 주 (어제가 포함된 주)
        const yesterday = subDays(new Date(), 1);
        targetDate = yesterday;
      }

      // ISO 8601 기준으로 주차 포맷 생성
      const isoYear = getISOWeekYear(targetDate);
      const isoWeek = getISOWeek(targetDate);
      const weeklyPeriod = `${isoYear}-W${isoWeek.toString().padStart(2, '0')}`;

      const rankingRepo = AppDataSource.getRepository(RankingScore);

      // 내 기록 조회
      const myRecord = await rankingRepo.findOne({
        where: {
          user: { id: userId },
          rankingType: RankingType.WEEKLY,
          period: weeklyPeriod,
        },
        relations: ['user', 'user.userBadges', 'user.userBadges.badge'],
      });

      if (!myRecord) {
        const response: Ranking = {
          rank: undefined,
          user: {
            id: userId,
            nickName: undefined,
            picture: undefined,
            userBadges: [],
            equippedBadgeIds: [],
          },
          score: 0,
          totalAttempts: 0,
          correctAnswers: 0,
          accuracy: 0,
        };
        return reply.status(200).send({
          success: true,
          data: response,
        });
      }

      // 내보다 점수가 높은 사용자 수 계산 (순위)
      const higherScoreCount = await rankingRepo.count({
        where: {
          rankingType: RankingType.WEEKLY,
          period: weeklyPeriod,
          score: MoreThan(myRecord.score),
        },
      });

      const myRank = higherScoreCount + 1;

      const response: Ranking = {
        rank: myRank,
        user: {
          id: myRecord.user.id,
          nickName: convertNullToUndefined(myRecord.user.nickName),
          picture: convertNullToUndefined(myRecord.user.picture),
          userBadges: myRecord.user.userBadges?.map(userBadge => ({
            id: userBadge.id,
            badge: {
              ...userBadge.badge,
              createdAt: userBadge.badge.createdAt.toISOString(),
              updatedAt: userBadge.badge.updatedAt.toISOString(),
            },
            createdAt: userBadge.createdAt.toISOString(),
          })) || [],
          equippedBadgeIds: myRecord.user.equippedBadgeIds || [],
        },
        score: myRecord.score,
        totalAttempts: myRecord.totalAttempts,
        correctAnswers: myRecord.correctAnswers,
        accuracy: myRecord.totalAttempts > 0 ? Math.round((myRecord.correctAnswers / myRecord.totalAttempts) * 100) : 0,
      };

      console.log('my weekly response :::::::: ', response)

      return reply.status(200).send({
        success: true,
        data: response,
        period: {
          type: 'weekly',
          value: weeklyPeriod,
          displayName: `${isoYear}년 ${isoWeek}주차`,
          year: isoYear,
          week: isoWeek
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get my weekly ranking',
      });
    }
  }

  // 나의 월간 랭킹 조회
  async getMyMonthlyRanking(request: FastifyRequest<{ Querystring: MonthlyRankingQuery }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'User not authenticated',
        });
      }

      const { mYear, month, current } = request.query;
      let targetDate = new Date();

      if (mYear && month) {
        targetDate = new Date(mYear, month - 1, 1); // 월은 0부터 시작
      } else if (current === 'true') {
        // 현재 월 (어제가 포함된 월)
        const yesterday = subDays(new Date(), 1);
        targetDate = yesterday;
      } else {
        // 기본값: 현재 월 (어제가 포함된 월)
        const yesterday = subDays(new Date(), 1);
        targetDate = yesterday;
      }
      
      const monthlyPeriod = format(targetDate, 'yyyy-MM');
      const rankingRepo = AppDataSource.getRepository(RankingScore);

      // 내 기록 조회
      const myRecord = await rankingRepo.findOne({
        where: {
          user: { id: userId },
          rankingType: RankingType.MONTHLY,
          period: monthlyPeriod,
        },
        relations: ['user', 'user.userBadges', 'user.userBadges.badge'],
      });

      if (!myRecord) {
        const response: Ranking = {
          rank: undefined,
          user: {
            id: userId,
            nickName: undefined,
            picture: undefined,
            userBadges: [],
            equippedBadgeIds: [],
          },
          score: 0,
          totalAttempts: 0,
          correctAnswers: 0,
          accuracy: 0,
        };
        return reply.status(200).send({
          success: true,
          data: response,
        });
      }

      // 내보다 점수가 높은 사용자 수 계산 (순위)
      const higherScoreCount = await rankingRepo.count({
        where: {
          rankingType: RankingType.MONTHLY,
          period: monthlyPeriod,
          score: MoreThan(myRecord.score),
        },
      });

      const myRank = higherScoreCount + 1;

      const response: Ranking = {
        rank: myRank,
        user: {
          id: myRecord.user.id,
          nickName: convertNullToUndefined(myRecord.user.nickName),
          picture: convertNullToUndefined(myRecord.user.picture),
          userBadges: myRecord.user.userBadges?.map(userBadge => ({
            id: userBadge.id,
            badge: {
              ...userBadge.badge,
              createdAt: userBadge.badge.createdAt.toISOString(),
              updatedAt: userBadge.badge.updatedAt.toISOString(),
            },
            createdAt: userBadge.createdAt.toISOString(),
          })) || [],
          equippedBadgeIds: myRecord.user.equippedBadgeIds || [],
        },
        score: myRecord.score,
        totalAttempts: myRecord.totalAttempts,
        correctAnswers: myRecord.correctAnswers,
        accuracy: myRecord.totalAttempts > 0 ? Math.round((myRecord.correctAnswers / myRecord.totalAttempts) * 100) : 0,
      };
      
      console.log('my monthly response :::::::: ', response)

      return reply.status(200).send({
        success: true,
        data: response,
        period: {
          type: 'monthly',
          value: monthlyPeriod,
          displayName: format(targetDate, 'yyyy년 MM월'),
          year: targetDate.getFullYear(),
          month: targetDate.getMonth() + 1
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get my monthly ranking',
      });
    }
  }

  // 나의 일간 랭킹 조회
  async getMyDailyRanking(request: FastifyRequest<{ Querystring: DailyRankingQuery }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'User not authenticated',
        });
      }

      const { date } = request.query;
      let targetDate = new Date();

      if (date) {
        targetDate = new Date(date); // YYYY-MM-DD 형식의 문자열을 Date 객체로 변환
      } else {
        targetDate = subDays(targetDate, 1); // 기본값: 어제
      }
      const dailyPeriod = format(targetDate, 'yyyy-MM-dd');
      const rankingRepo = AppDataSource.getRepository(RankingScore);

      // 내 기록 조회
      const myRecord = await rankingRepo.findOne({
        where: {
          user: { id: userId },
          rankingType: RankingType.DAILY,
          period: dailyPeriod,
        },
        relations: ['user', 'user.userBadges', 'user.userBadges.badge'],
      });

      if (!myRecord) {
        const response: Ranking = {
          rank: undefined,
          user: {
            id: userId,
            nickName: undefined,
            picture: undefined,
            userBadges: [],
            equippedBadgeIds: [],
          },
          score: 0,
          totalAttempts: 0,
          correctAnswers: 0,
          accuracy: 0,
        };
        return reply.status(200).send({
          success: true,
          data: response,
        });
      }

      // 내보다 점수가 높은 사용자 수 계산 (순위)
      const higherScoreCount = await rankingRepo.count({
        where: {
          rankingType: RankingType.DAILY,
          period: dailyPeriod,
          score: MoreThan(myRecord.score),
        },
      });

      const myRank = higherScoreCount + 1;

      const response: Ranking = {
        rank: myRank,
        user: {
          id: myRecord.user.id,
          nickName: convertNullToUndefined(myRecord.user.nickName),
          picture: convertNullToUndefined(myRecord.user.picture),
          userBadges: myRecord.user.userBadges?.map(userBadge => ({
            id: userBadge.id,
            badge: {
              ...userBadge.badge,
              createdAt: userBadge.badge.createdAt.toISOString(),
              updatedAt: userBadge.badge.updatedAt.toISOString(),
            },
            createdAt: userBadge.createdAt.toISOString(),
          })) || [],
          equippedBadgeIds: myRecord.user.equippedBadgeIds || [],
        },
        score: myRecord.score,
        totalAttempts: myRecord.totalAttempts,
        correctAnswers: myRecord.correctAnswers,
        accuracy: myRecord.totalAttempts > 0 ? Math.round((myRecord.correctAnswers / myRecord.totalAttempts) * 100) : 0,
      };

      console.log('my daily response :::::::: ', response)

      return reply.status(200).send({
        success: true,
        data: response,
        period: {
          type: 'daily',
          value: dailyPeriod,
          displayName: format(targetDate, 'yyyy년 MM월 dd일'),
          year: targetDate.getFullYear(),
          month: targetDate.getMonth() + 1,
          day: targetDate.getDate()
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get my daily ranking',
      });
    }
  }
}
