import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRankingScoreTable1752947867820 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TYPE IF EXISTS "ranking_scores_rankingtype_enum";
            CREATE TYPE "ranking_scores_rankingtype_enum" AS ENUM('WEEKLY', 'MONTHLY');
            CREATE TABLE "ranking_scores" (
                "id" SERIAL NOT NULL,
                "score" integer NOT NULL DEFAULT 0,
                "totalAttempts" integer NOT NULL DEFAULT 0,
                "correctAnswers" integer NOT NULL DEFAULT 0,
                "rankingType" "ranking_scores_rankingtype_enum" NOT NULL,
                "period" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" character varying,
                CONSTRAINT "PK_a4b742c29f1d7d4c4a0d4a4b4c4" PRIMARY KEY ("id")
            );
            CREATE UNIQUE INDEX "IDX_ranking_type_period_user" ON "ranking_scores" ("rankingType", "period", "userId");
            ALTER TABLE "ranking_scores" ADD CONSTRAINT "FK_USER_RANKING_SCORE" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ranking_scores" DROP CONSTRAINT "FK_USER_RANKING_SCORE";
            DROP INDEX "IDX_ranking_type_period_user";
            DROP TABLE "ranking_scores";
            DROP TYPE "ranking_scores_rankingtype_enum";
        `);
    }

}