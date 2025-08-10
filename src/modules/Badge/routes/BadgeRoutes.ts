import { FastifyInstance } from 'fastify';
import { BadgeController } from '@/modules/Badge/controllers/BadgeController';
import { adminAuthHook } from '@/plugins/adminAuth';
import { CreateBadgeSchema, UpdateBadgeSchema, GetBadgesQuerySchema } from '@/modules/Badge/interfaces/Badge';

async function badgeRoutes(fastify: FastifyInstance) {
  fastify.post('/', {
    preHandler: [adminAuthHook],
    schema: { body: CreateBadgeSchema, tags: ['Badge'],},
    handler: BadgeController.createBadge
  });

  fastify.get('/', {
    schema: { querystring: GetBadgesQuerySchema, tags: ['Badge'] },
    handler: BadgeController.getAllBadges
  });

  fastify.put('/:id', {
    preHandler: [adminAuthHook],
    schema: { body: UpdateBadgeSchema , tags: ['Badge']},
    handler: BadgeController.updateBadge
  });

  fastify.delete('/:id', {
    preHandler: [adminAuthHook],
    schema: { tags: ['Badge'] },
    handler: BadgeController.deleteBadge
  });
}

export default badgeRoutes;
