import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAnswerTable1753373999999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "answer",
            columns: [
                { name: "id", type: "serial", isPrimary: true },
                { name: "userId", type: "varchar" },
                { name: "quizId", type: "int" },
                { name: "categoryId", type: "int" },
                { name: "userAnswer", type: "varchar" },
                { name: "isCorrect", type: "boolean" },
                { name: "point", type: "int", default: 0 },
                { name: "bonusPoint", type: "int", default: 0 },
                { name: "timeTaken", type: "int", isNullable: true },
                { name: "createdAt", type: "timestamptz", default: "now()" },
                { name: "updatedAt", type: "timestamptz", default: "now()" },
            ],
        }), true);

        await queryRunner.createForeignKey("answer", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("answer", new TableForeignKey({
            columnNames: ["quizId"],
            referencedColumnNames: ["id"],
            referencedTableName: "quiz",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("answer");
    }
}
