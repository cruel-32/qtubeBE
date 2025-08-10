import { FastifyInstance } from 'fastify';
import { UserBadgeController } from '@/modules/UserBadge/controllers/UserBadgeController';
import { AcquireBadgeSchema } from '@/modules/UserBadge/interfaces/UserBadge';

async function userBadgeRoutes(fastify: FastifyInstance) {
  fastify.post('/', {
    schema: { body: AcquireBadgeSchema, tags: ['UserBadge'] },
    handler: UserBadgeController.acquireBadge
  });

  fastify.get('/me', {
    schema: { tags: ['UserBadge'] },
    handler: UserBadgeController.getMyBadges
  });
}

export default userBadgeRoutes;
