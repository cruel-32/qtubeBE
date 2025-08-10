import { PostgresDb } from '@fastify/postgres'
import { RedisClientType } from '@fastify/redis'
import { DataSource, Repository } from 'typeorm'
import { Quiz, User, Answer, Category, Report, UserBadge, Badge } from '@/entities'

interface UserPayload {
  id: string;
  name: string;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user: UserPayload;
  }

  interface FastifyInstance {
    pg: PostgresDb
    redis: RedisClientType
    orm: DataSource
    repositories: {
      quiz: Repository<Quiz>
      user: Repository<User>
      answer: Repository<Answer>
      category: Repository<Category>
      report: Repository<Report>
      badge: Repository<Badge>
      userBadge: Repository<UserBadge>
    }
  }
}