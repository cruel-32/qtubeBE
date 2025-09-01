import { MigrationDataSource } from '../config/migration-data-source';
import * as fs from 'fs';
import * as path from 'path';

async function seedBadges() {
  try {
    console.log('Initializing data source...');
    await MigrationDataSource.initialize();
    console.log('Data source initialized.');

    const queryRunner = MigrationDataSource.createQueryRunner();

    console.log('Truncating badges table...');
    await queryRunner.query('TRUNCATE TABLE "badges" RESTART IDENTITY CASCADE;');

    console.log('Seeding badges...');
    const sqlFilePath = path.join(__dirname, '../../sql/badges.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    const queries = sql.split(';').filter(q => q.trim().length > 0);

    for (const query of queries) {
        await queryRunner.query(query);
    }

    console.log('Badges have been seeded successfully.');

  } catch (error) {
    console.error('Error during badge seeding:', error);
  } finally {
    if (MigrationDataSource.isInitialized) {
      await MigrationDataSource.destroy();
      console.log('Data source connection closed.');
    }
  }
}

seedBadges();
