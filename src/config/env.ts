import { z } from 'zod'
import dotenv from 'dotenv'

// Only load local env file outside production (e.g., Railway)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.development' })
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.string().transform(Number).default('8080'),
  
  // Database
  DB_HOST: z.string().optional(),
  DB_PORT: z.string().transform(Number).optional(),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  // Common PG envs (Railway, Heroku, etc.)
  PGHOST: z.string().optional(),
  PGPORT: z.string().transform(Number).optional(),
  PGDATABASE: z.string().optional(),
  PGUSER: z.string().optional(),
  PGPASSWORD: z.string().optional(),
  
  // Redis
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().transform(Number).optional(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),
  ADMIN_USER_IDS: z.string().optional().default(''),
  CORS_ORIGIN: z.string().optional().default('*'),
  SWAGGER_ENABLED: z.string().transform(v => v === 'true').optional().default('false'),
  API_HOST: z.string().optional(),
  // Firebase Admin credentials
  FIREBASE_ADMIN_SDK_PATH: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
})

const env = envSchema.parse(process.env)

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  
  database: {
    host: env.DB_HOST ?? env.PGHOST,
    port: env.DB_PORT ?? env.PGPORT,
    name: env.DB_NAME ?? env.PGDATABASE,
    user: env.DB_USER ?? env.PGUSER,
    password: env.DB_PASSWORD ?? env.PGPASSWORD,
    url: env.DATABASE_URL,
  },
  
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    url: env.REDIS_URL,
  },

  jwtSecret: env.JWT_SECRET,
  jwtRefreshSecret: env.JWT_REFRESH_SECRET,
  adminUserIds: env.ADMIN_USER_IDS ? env.ADMIN_USER_IDS.split(',').filter(Boolean) : [],
  corsOrigin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : ['*'],
  swaggerEnabled: env.SWAGGER_ENABLED ?? false,
  apiHost: env.API_HOST,
  firebaseAdminSdkPath: env.FIREBASE_ADMIN_SDK_PATH,
  firebaseProjectId: env.FIREBASE_PROJECT_ID,
  firebaseClientEmail: env.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: env.FIREBASE_PRIVATE_KEY,
}