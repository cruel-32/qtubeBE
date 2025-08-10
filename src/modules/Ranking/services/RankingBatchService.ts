import cron from 'node-cron';
import { format, subDays, getISOWeek, getISOWeekYear } from 'date-fns';
import { AppDataSource } from '@/config/database';
import { Answer } from '@/entities/Answer';
import { RankingScore, RankingType } from '@/entities/RankingScore';

class RankingBatchService {
  public start(): void {
    // 매일 새벽 2시에 실행
    cron.schedule('0 2 * * *', () => {
      console.log('Running ranking batch service...');
      this.updateScores();
    });
  }

  public async updateScores(): Promise<void> {
    // 한국 시간 기준으로 어제 날짜를 계산한 후 UTC로 변환하여 DB 쿼리
    const nowKST = new Date(Date.now() + 9 * 60 * 60 * 1000); // 현재 KST 시간
    const yesterdayKST = subDays(nowKST, 1); // KST 기준 어제
    
    // KST 기준 어제 00:00:00
    const startDateKST = new Date(
      yesterdayKST.getFullYear(),
      yesterdayKST.getMonth(),
      yesterdayKST.getDate(),
      0, 0, 0, 0
    );
    
    // KST 기준 어제 23:59:59
    const endDateKST = new Date(
      yesterdayKST.getFullYear(),
      yesterdayKST.getMonth(),
      yesterdayKST.getDate(),
      23, 59, 59, 999
    );
    
    // KST를 UTC로 변환 (DB 쿼리용)
    const startDateUTC = new Date(startDateKST.getTime() - 9 * 60 * 60 * 1000);
    const endDateUTC = new Date(endDateKST.getTime() - 9 * 60 * 60 * 1000);

    // 디버깅: 날짜 범위 로그
    console.log('Date ranges (KST basis):', {
      nowKST: nowKST.toISOString(),
      yesterdayKST: yesterdayKST.toISOString(),
      kst: {
        startDate: startDateKST.toISOString(),
        endDate: endDateKST.toISOString()
      },
      utc: {
        startDate: startDateUTC.toISOString(),
        endDate: endDateUTC.toISOString()
      }
    });

    // SQL 쿼리 로깅 활성화 - UTC 저장된 데이터를 KST 기준으로 필터링
    const queryBuilder = AppDataSource.getRepository(Answer)
      .createQueryBuilder('answer')
      .select('answer.userId', 'userId')
      .addSelect('COUNT(answer.id)', 'dailyAttempts')
      .addSelect('SUM(CASE WHEN answer.isCorrect = true THEN 1 ELSE 0 END)', 'dailyCorrectAnswers')
      .addSelect('COALESCE(SUM(CASE WHEN answer.point IS NOT NULL THEN answer.point ELSE 0 END), 0)', 'points')
      .addSelect('COALESCE(SUM(CASE WHEN answer.bonusPoint IS NOT NULL THEN answer.bonusPoint ELSE 0 END), 0)', 'bonusPoints')
      .where('answer.createdAt BETWEEN :startDate AND :endDate', { 
        startDate: startDateUTC, 
        endDate: endDateUTC 
      })
      .groupBy('answer.userId')
      .having('COUNT(answer.id) > 0');

    // 실제 SQL 쿼리와 파라미터 출력
    const sql = queryBuilder.getSql();
    const parameters = queryBuilder.getParameters();
    
    console.log('==================== SQL QUERY DEBUG ====================');
    console.log('Generated SQL:', sql);
    console.log('Query parameters:', parameters);
    console.log('Querying UTC range:', {
      start: startDateUTC.toISOString(),
      end: endDateUTC.toISOString()
    });
    console.log('Corresponds to KST range:', {
      start: startDateKST.toISOString(),
      end: endDateKST.toISOString()
    });
    console.log('=========================================================');

    // 쿼리 실행 전에 간단한 카운트 쿼리도 실행해보기
    const totalAnswerCount = await AppDataSource.getRepository(Answer)
      .createQueryBuilder('answer')
      .where('answer.createdAt BETWEEN :startDate AND :endDate', { 
        startDate: startDateUTC, 
        endDate: endDateUTC 
      })
      .getCount();
    
    console.log(`Total answers in KST date range: ${totalAnswerCount}`);

    const dailyStats = await queryBuilder.getRawMany();

    // 디버깅: 수집된 데이터 로그
    console.log('Collected stats count:', dailyStats.length);
    console.log('Collected stats:', dailyStats);

    // 기간 포맷 (KST 기준 어제 날짜로 생성) - ISO 8601 기준으로 변경
    const dailyPeriod = format(yesterdayKST, 'yyyy-MM-dd');
    
    // ISO 8601 기준 주차 계산
    const isoYear = getISOWeekYear(yesterdayKST);
    const isoWeek = getISOWeek(yesterdayKST);
    const weeklyPeriod = `${isoYear}-W${isoWeek.toString().padStart(2, '0')}`;
    
    const monthlyPeriod = format(yesterdayKST, 'yyyy-MM');

    console.log('Period formats (KST basis, ISO 8601):', {
      dailyPeriod,
      weeklyPeriod,
      monthlyPeriod,
      isoWeekDetails: {
        year: isoYear,
        week: isoWeek
      }
    });

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      for (const stat of dailyStats) {
        const { userId, dailyAttempts, dailyCorrectAnswers, points, bonusPoints } = stat;
        
        // 안전한 숫자 변환
        const safeAttempts = Number(dailyAttempts) || 0;
        const safeCorrectAnswers = Number(dailyCorrectAnswers) || 0;
        const safePoints = Number(points) || 0;
        const safeBonusPoints = Number(bonusPoints) || 0;
        const totalScore = safePoints + safeBonusPoints;

        // 디버깅: 변환된 값들 로그
        console.log(`Processing user ${userId}:`, {
          attempts: safeAttempts,
          correct: safeCorrectAnswers,
          points: safePoints,
          bonus: safeBonusPoints,
          total: totalScore
        });

        // 일간 랭킹 업데이트 (덮어쓰기)
        await transactionalEntityManager.createQueryBuilder()
          .insert()
          .into(RankingScore)
          .values({
            user: { id: userId },
            rankingType: RankingType.DAILY,
            period: dailyPeriod,
            totalAttempts: safeAttempts,
            correctAnswers: safeCorrectAnswers,
            score: totalScore,
          })
          .onConflict(`("rankingType", "period", "userId") DO UPDATE SET
            "totalAttempts" = :totalAttempts,
            "correctAnswers" = :correctAnswers,
            "score" = :score`)
          .setParameter('totalAttempts', safeAttempts)
          .setParameter('correctAnswers', safeCorrectAnswers)
          .setParameter('score', totalScore)
          .execute();

        // 주간 랭킹 업데이트 (누적) - ISO 8601 기준
        await transactionalEntityManager.createQueryBuilder()
          .insert()
          .into(RankingScore)
          .values({
            user: { id: userId },
            rankingType: RankingType.WEEKLY,
            period: weeklyPeriod,
            totalAttempts: safeAttempts,
            correctAnswers: safeCorrectAnswers,
            score: totalScore,
          })
          .onConflict(`("rankingType", "period", "userId") DO UPDATE SET
            "totalAttempts" = "ranking_scores"."totalAttempts" + :dailyAttempts,
            "correctAnswers" = "ranking_scores"."correctAnswers" + :dailyCorrectAnswers,
            "score" = "ranking_scores"."score" + :dailyScore`)
          .setParameter('dailyAttempts', safeAttempts)
          .setParameter('dailyCorrectAnswers', safeCorrectAnswers)
          .setParameter('dailyScore', totalScore)
          .execute();

        // 월간 랭킹 업데이트 (누적)
        await transactionalEntityManager.createQueryBuilder()
          .insert()
          .into(RankingScore)
          .values({
            user: { id: userId },
            rankingType: RankingType.MONTHLY,
            period: monthlyPeriod,
            totalAttempts: safeAttempts,
            correctAnswers: safeCorrectAnswers,
            score: totalScore,
          })
          .onConflict(`("rankingType", "period", "userId") DO UPDATE SET
            "totalAttempts" = "ranking_scores"."totalAttempts" + :dailyAttempts,
            "correctAnswers" = "ranking_scores"."correctAnswers" + :dailyCorrectAnswers,
            "score" = "ranking_scores"."score" + :dailyScore`)
          .setParameter('dailyAttempts', safeAttempts)
          .setParameter('dailyCorrectAnswers', safeCorrectAnswers)
          .setParameter('dailyScore', totalScore)
          .execute();
      }
    });

    console.log('Ranking batch process completed successfully (KST basis, ISO 8601)');
  }
}

export default RankingBatchService;
