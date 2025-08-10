import { FastifyInstance } from 'fastify';
import answerRoutes from '@/modules/Answer/routes/AnswerRoutes';
import authRoutes from '@/modules/Auth/routes/AuthRoutes';
import categoryRoutes from '@/modules/Category/routes/CategoryRoutes';
import quizRoutes from '@/modules/Quiz/routes/QuizRoutes';
import userRoutes from '@/modules/User/routes/UserRoutes';
import reportRoutes from '@/modules/Report/routes/ReportRoutes';
import rankingRoutes from '@/modules/Ranking/routes/RankingRoutes';
import badgeRoutes from '@/modules/Badge/routes/BadgeRoutes';
import userBadgeRoutes from '@/modules/UserBadge/routes/UserBadgeRoutes';


export default async function (fastify: FastifyInstance) {
  fastify.register(answerRoutes, { prefix: '/answers' });
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(categoryRoutes, { prefix: '/categories' });
  fastify.register(quizRoutes, { prefix: '/quizzes' });
  fastify.register(userRoutes, { prefix: '/users' });
  fastify.register(reportRoutes, { prefix: '/reports' });
  fastify.register(rankingRoutes, { prefix: '/ranking' });
  fastify.register(badgeRoutes, { prefix: '/badges' });
  fastify.register(userBadgeRoutes, { prefix: '/user-badges' });
  
}
