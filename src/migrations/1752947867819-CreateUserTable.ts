import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1752947867819 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_platform_enum" AS ENUM('google', 'naver', 'kakao')`);
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "nickName",
                    type: "varchar",
                },
                {
                    name: "refreshToken",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "picture",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "platform",
                    type: "enum",
                    enumName: "user_platform_enum",
                },
                {
                    name: "email",
                    type: "varchar",
                },
                {
                    name: "profile",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "introduction",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "profileImage",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "createdAt",
                    type: "timestamptz",
                    default: "now()",
                },
                {
                    name: "updatedAt",
                    type: "timestamptz",
                    default: "now()",
                },
                {
                    name: "fcmToken",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "pushNotificationsEnabled",
                    type: "boolean",
                    default: true,
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user");
        await queryRunner.query(`DROP TYPE "public"."user_platform_enum"`);
    }

}
