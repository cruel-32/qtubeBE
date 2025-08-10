import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddIsActiveToCategory1752793811665 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "category",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: false,
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "parentId",
                    type: "int",
                    isNullable: true,
                },
                {
                    name: "createdAt",
                    type: "timestamptz",
                    default: "now()",
                },
                {
                    name: "isActive",
                    type: "boolean",
                    default: true,
                },
                {
                    name: "updatedAt",
                    type: "timestamptz",
                    default: "now()",
                },
            ],
        }), true);

        await queryRunner.createForeignKey("category", new TableForeignKey({
            columnNames: ["parentId"],
            referencedColumnNames: ["id"],
            referencedTableName: "category",
            onDelete: "SET NULL",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("category");
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("parentId") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("category", foreignKey);
            }
            await queryRunner.dropTable("category");
        }
    }

}