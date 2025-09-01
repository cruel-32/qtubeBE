import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBadgeConditionToJsonb1756531912065 implements MigrationInterface {
    name = 'UpdateBadgeConditionToJsonb1756531912065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "badges" ALTER COLUMN "condition" SET DATA TYPE jsonb USING "condition"::jsonb`);
        await queryRunner.query(`ALTER TABLE "badges" ALTER COLUMN "condition" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "badges" ALTER COLUMN "condition" TYPE character varying(255) USING "condition"::text`);
    }

}
