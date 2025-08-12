import { FastifyInstance } from 'fastify'
import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from '@/config/env'
import { Quiz, User, Answer, Category, Report, RankingScore, Badge, UserBadge } from '@/entities'

const baseOptions: DataSourceOptions = {
  type: 'postgres',
  synchronize: true, // config.nodeEnv === 'development',
  logging: config.nodeEnv === 'development',
  entities: [Quiz, User, Answer, Category, Report, RankingScore, Badge, UserBadge],
  migrations: [__dirname + '/../migrations/**/*.{ts,js}'],
  subscribers: [__dirname + '/../subscribers/**/*.{ts,js}'],
  extra: {
    timezone: 'UTC',
    ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  },
};

const dataSourceOptions: DataSourceOptions = config.nodeEnv === 'production' && config.database.url
  ? {
      ...baseOptions,
      url: config.database.url,
    }
  : {
      ...baseOptions,
      host: config.database.host,
      port: config.database.port,
      username: config.database.user,
      password: config.database.password,
      database: config.database.name,
    };

export const AppDataSource = new DataSource(dataSourceOptions);


export const registerPostgres = async (fastify: FastifyInstance) => {
  const connectionString = config.nodeEnv === 'production' && config.database.url
    ? config.database.url
    : `postgresql://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}`;

  console.log('connectionString :::::: ', connectionString);
  await fastify.register(require('@fastify/postgres'), {
    connectionString: connectionString,
    ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  })
}

export const connectDatabase = async (fastify: FastifyInstance): Promise<void> => {
  try {
    // Guard: In production, ensure we are not trying to use localhost defaults without config
    if (config.nodeEnv === 'production') {
      const hasUrl = Boolean(config.database.url)
      const hasAllDirect = Boolean(
        config.database.host && config.database.port && config.database.user && config.database.name
      )
      if (!hasUrl && !hasAllDirect) {
        throw new Error('Database configuration missing in production. Set DATABASE_URL or full DB_* / PG* vars.')
      }
    }
    // TypeORM 연결
    await AppDataSource.initialize()
    fastify.log.info('TypeORM connection established successfully')
    
    // Fastify Postgres 플러그인 등록 (기존 코드와의 호환성을 위해)
    await registerPostgres(fastify)
    fastify.log.info('Fastify PostgreSQL plugin registered successfully')
  } catch (error) {
    fastify.log.error('Error connecting to database:', error)
    fastify.log.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    fastify.log.error('Database config:', {
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      url: config.database.url,
    })
    console.error('Full error object:', error)
    throw error
  }
}