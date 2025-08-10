import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeBadgeConditionType1753535727090 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. 기존 컬럼 삭제
    await queryRunner.dropColumn('badges', 'condition');
    // 2. NULL을 허용하는 새로운 jsonb 타입의 컬럼 추가
    await queryRunner.addColumn('badges', new TableColumn({
      name: 'condition',
      type: 'jsonb',
      isNullable: true, // 임시로 NULL 허용
    }));
    // 3. 기존 데이터에 기본값 설정
    await queryRunner.query(`UPDATE "badges" SET "condition" = '{}'::jsonb WHERE "condition" IS NULL`);
    // 4. NOT NULL 제약 조건 추가
    await queryRunner.query(`ALTER TABLE "badges" ALTER COLUMN "condition" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'badges',
      'condition',
      new TableColumn({
        name: 'condition',
        type: 'varchar',
        length: '255',
        isNullable: false,
      }),
    );
  }
}