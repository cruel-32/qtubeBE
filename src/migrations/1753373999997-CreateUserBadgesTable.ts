import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUserBadgesTable1753373999997 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "user_badges",
            columns: [
                { name: "id", type: "serial", isPrimary: true },
                { name: "userId", type: "varchar" },
                { name: "badgeId", type: "int" },
                { name: "createdAt", type: "timestamptz", default: "now()" },
            ],
        }), true);

        await queryRunner.createForeignKey("user_badges", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("user_badges", new TableForeignKey({
            columnNames: ["badgeId"],
            referencedColumnNames: ["id"],
            referencedTableName: "badges",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user_badges");
    }
}
