import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryIdToAnswer1754476266503 implements MigrationInterface {
    name = 'AddCategoryIdToAnswer1754476266503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ADD "categoryId" integer`);
        await queryRunner.query(`UPDATE "answer" SET "categoryId" = 0 WHERE "categoryId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "categoryId" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "categoryId"`);
    }

}
