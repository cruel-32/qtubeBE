import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToCategory1752793811665 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "category" SET "isActive" = TRUE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Note: We are not dropping the column here as it was likely added by synchronize:true
        // If you need to explicitly drop it, uncomment the line below:
        // await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "isActive"`);
    }

}
