import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.development' })

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  
  // Database
  DB_HOST: z.string().optional(),
  DB_PORT: z.string().transform(Number).optional(),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  
  // Redis
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().transform(Number),
  REDIS_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ADMIN_USER_IDS: z.string(),
  CORS_ORIGIN: z.string(),
  SWAGGER_ENABLED: z.string().transform(v => v === 'true'),
  API_HOST: z.string(),
  FIREBASE_ADMIN_SDK_PATH: z.string(),
})

const env = envSchema.parse(process.env)

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  
  database: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    url: env.DATABASE_URL,
  },
  
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    url: env.REDIS_URL,
  },

  jwtSecret: env.JWT_SECRET,
  jwtRefreshSecret: env.JWT_REFRESH_SECRET,
  adminUserIds: env.ADMIN_USER_IDS.split(','),
  corsOrigin: env.CORS_ORIGIN.split(','),
  swaggerEnabled: env.SWAGGER_ENABLED,
  apiHost: env.API_HOST,
  firebaseAdminSdkPath: env.FIREBASE_ADMIN_SDK_PATH,
}