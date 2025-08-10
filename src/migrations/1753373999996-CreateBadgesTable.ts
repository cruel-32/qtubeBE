import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBadgesTable1753373999996 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "badges",
            columns: [
                { name: "id", type: "serial", isPrimary: true },
                { name: "name", type: "varchar", length: "255" },
                { name: "description", type: "varchar", length: "255" },
                { name: "imageUrl", type: "varchar", length: "255" },
                { name: "type", type: "varchar", length: "50" },
                { name: "condition", type: "varchar", length: "255" },
                { name: "grade", type: "varchar", length: "50" },
                { name: "createdAt", type: "timestamptz", default: "now()" },
                { name: "updatedAt", type: "timestamptz", default: "now()" },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("badges");
    }
}
