import { FastifyInstance } from 'fastify';
import quizRoutes from '@/pages/Quiz/routes';

export const pageRoutes = async (fastify: FastifyInstance) => {
    fastify.register(quizRoutes, { prefix: '/quizzes' });
  }
  