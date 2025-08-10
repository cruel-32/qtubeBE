import { DataSource } from 'typeorm';
import { config } from '@/config/env';
import { Quiz, User, Answer, Category, Report, RankingScore, Badge, UserBadge } from '@/entities';

export const MigrationDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  entities: [Quiz, User, Answer, Category, Report, RankingScore, Badge, UserBadge],
  migrations: [__dirname + '/../migrations/**/*.{ts,js}'],
});
