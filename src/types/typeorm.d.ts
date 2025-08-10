import { DataSource, Repository } from 'typeorm'
import { Quiz, User, Answer, Category, Report, Badge, UserBadge } from '@/entities'
import { Redis } from 'ioredis'

declare module 'fastify' {
  interface FastifyInstance {
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
    redis: Redis
    pg: {
      query: (text: string, params?: any[]) => Promise<{ rows: any[] }>
    }
  }
}