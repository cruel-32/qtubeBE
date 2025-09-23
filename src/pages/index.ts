import { FastifyInstance } from 'fastify';
import quizRoutes from '@/pages/Quiz/routes';
import privacyRoutes from '@/pages/Privacy/routes';
import supportRoutes from '@/pages/Support/routes';

export const pageRoutes = async (fastify: FastifyInstance) => {
    fastify.register(quizRoutes, { prefix: '/quizzes' });
    fastify.register(privacyRoutes, { prefix: '/privacy' });
    fastify.register(supportRoutes, { prefix: '/support' });
  }
  