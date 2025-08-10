import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertTimestampsToUTC1753374000000 implements MigrationInterface {
    name = 'ConvertTimestampsToUTC1753374000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. 기존 timestamp 컬럼들을 timestamptz로 변환하고 현재 시간을 UTC로 설정
        
        // Answer 테이블
        await queryRunner.query(`
            ALTER TABLE "answer" 
            ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'UTC',
            ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'UTC'
        `);

        // Quiz 테이블  
        await queryRunner.query(`
            ALTER TABLE "quiz" 
            ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'UTC',
            ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'UTC'
        `);

        // User 테이블
        await queryRunner.query(`
            ALTER TABLE "user" 
            ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'UTC',
            ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'UTC'
        `);

        // Badge 테이블
        await queryRunner.query(`
            ALTER TABLE "badges" 
            ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'UTC',
            ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'UTC'
        `);

        // RankingScore 테이블
        await queryRunner.query(`
            ALTER TABLE "ranking_scores" 
            ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'UTC',
            ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'UTC'
        `);

        // Report 테이블
        // await queryRunner.query(`
        //     ALTER TABLE "report" 
        //     ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'UTC',
        //     ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'UTC'
        // `);

        // UserBadge 테이블
        // await queryRunner.query(`
        //     ALTER TABLE "user_badge" 
        //     ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'UTC'
        // `);

        // Category 테이블
        await queryRunner.query(`
            ALTER TABLE "category" 
            ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'UTC',
            ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'UTC'
        `);

        // 2. 데이터베이스 타임존을 UTC로 설정
        await queryRunner.query(`SET timezone = 'UTC'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 롤백 시 timestamptz를 다시 timestamp로 변환
        
        await queryRunner.query(`
            ALTER TABLE "answer" 
            ALTER COLUMN "createdAt" TYPE timestamp,
            ALTER COLUMN "updatedAt" TYPE timestamp
        `);

        await queryRunner.query(`
            ALTER TABLE "quiz" 
            ALTER COLUMN "createdAt" TYPE timestamp,
            ALTER COLUMN "updatedAt" TYPE timestamp
        `);

        await queryRunner.query(`
            ALTER TABLE "user" 
            ALTER COLUMN "createdAt" TYPE timestamp,
            ALTER COLUMN "updatedAt" TYPE timestamp
        `);

        await queryRunner.query(`
            ALTER TABLE "badges" 
            ALTER COLUMN "createdAt" TYPE timestamp,
            ALTER COLUMN "updatedAt" TYPE timestamp
        `);

        await queryRunner.query(`
            ALTER TABLE "ranking_scores" 
            ALTER COLUMN "createdAt" TYPE timestamp,
            ALTER COLUMN "updatedAt" TYPE timestamp
        `);

        await queryRunner.query(`
            ALTER TABLE "report" 
            ALTER COLUMN "createdAt" TYPE timestamp,
            ALTER COLUMN "updatedAt" TYPE timestamp
        `);

        await queryRunner.query(`
            ALTER TABLE "user_badge" 
            ALTER COLUMN "createdAt" TYPE timestamp
        `);

        await queryRunner.query(`
            ALTER TABLE "category" 
            ALTER COLUMN "createdAt" TYPE timestamp,
            ALTER COLUMN "updatedAt" TYPE timestamp
        `);
    }
} 