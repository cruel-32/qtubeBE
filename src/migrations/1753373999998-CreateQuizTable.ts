import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateQuizTable1753373999998 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "quiz",
            columns: [
                { name: "id", type: "serial", isPrimary: true },
                { name: "question", type: "varchar" },
                { name: "answer1", type: "varchar", isNullable: true },
                { name: "answer2", type: "varchar", isNullable: true },
                { name: "answer3", type: "varchar", isNullable: true },
                { name: "answer4", type: "varchar", isNullable: true },
                { name: "correct", type: "varchar" },
                { name: "type", type: "int" },
                { name: "correctCount", type: "int", default: 0 },
                { name: "wrongCount", type: "int", default: 0 },
                { name: "categoryId", type: "int" },
                { name: "difficulty", type: "varchar", default: "'D'" },
                { name: "explanation", type: "varchar", isNullable: true },
                { name: "createdAt", type: "timestamptz", default: "now()" },
                { name: "updatedAt", type: "timestamptz", default: "now()" },
            ],
        }), true);

        await queryRunner.createForeignKey("quiz", new TableForeignKey({
            columnNames: ["categoryId"],
            referencedColumnNames: ["id"],
            referencedTableName: "category",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("quiz");
    }
}
