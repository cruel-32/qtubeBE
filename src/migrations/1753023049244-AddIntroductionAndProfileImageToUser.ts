import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIntroductionAndProfileImageToUser1753023049244 implements MigrationInterface {
    name = 'AddIntroductionAndProfileImageToUser1753023049244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "introduction" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "profileImage" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImage"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "introduction"`);
    }

}
