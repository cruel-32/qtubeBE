import { FastifyInstance } from 'fastify';
import { UserBadgeController } from '@/modules/UserBadge/controllers/UserBadgeController';
import { AcquireBadgeSchema, UpdateEquippedBadgesSchema } from '@/modules/UserBadge/interfaces/UserBadge';

async function userBadgeRoutes(fastify: FastifyInstance) {
  fastify.post('/', {
    schema: { body: AcquireBadgeSchema, tags: ['UserBadge'] },
    handler: UserBadgeController.acquireBadge
  });

  fastify.get('/me', {
    schema: { tags: ['UserBadge'] },
    handler: UserBadgeController.getMyBadges
  });

  fastify.get('/equipped', {
    schema: { tags: ['UserBadge'] },
    handler: UserBadgeController.getEquippedBadges
  });

  fastify.put('/equipped', {
    schema: { body: UpdateEquippedBadgesSchema, tags: ['UserBadge'] },
    handler: UserBadgeController.updateEquippedBadges
  });
}

export default userBadgeRoutes;
