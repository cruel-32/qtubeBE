import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryIdToAnswer1754476266503 implements MigrationInterface {
    name = 'AddCategoryIdToAnswer1754476266503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // This migration is now redundant because the categoryId column is
        // already added in the CreateAnswerTable migration.
        // This method is intentionally left empty.
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This migration is now redundant because the categoryId column is
        // already added in the CreateAnswerTable migration.
        // This method is intentionally left empty.
    }

}