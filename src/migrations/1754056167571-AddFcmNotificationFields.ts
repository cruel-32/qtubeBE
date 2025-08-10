import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFcmNotificationFields1754056167571 implements MigrationInterface {
    name = 'AddFcmNotificationFields1754056167571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "fcmToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "pushNotificationsEnabled" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pushNotificationsEnabled"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fcmToken"`);
    }

}
