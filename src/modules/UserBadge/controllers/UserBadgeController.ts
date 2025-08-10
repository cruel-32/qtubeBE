import { FastifyRequest, FastifyReply } from 'fastify';
import { AcquireBadgeInput } from '@/modules/UserBadge/interfaces/UserBadge';

export class UserBadgeController {
  static async acquireBadge(request: FastifyRequest<{ Body: AcquireBadgeInput }>, reply: FastifyReply) {
    try {
      // @ts-ignore
      const userId = request.user.id;
      const { badgeId } = request.body;

      const existing = await request.server.repositories.userBadge.findOneBy({ userId, badgeId });

      if (existing) {
        return reply.status(409).send({ success: false, message: 'Badge already acquired' });
      }

      const newUserBadge = request.server.repositories.userBadge.create({ userId, badgeId });
      await request.server.repositories.userBadge.save(newUserBadge);

      return reply.status(201).send({ success: true, data: newUserBadge });
    } catch (error) {
      request.log.error(error, '[UserBadgeController.acquireBadge] Failed to acquire badge');
      return reply.status(500).send({ success: false, message: 'Failed to acquire badge' });
    }
  }

  static async getMyBadges(request: FastifyRequest, reply: FastifyReply) {
    try {
      // @ts-ignore
      const userId = request.user.id;
      const myBadges = await request.server.repositories.userBadge.find({
        where: { userId },
        relations: ['badge'],
      });
      return reply.status(200).send({ success: true, data: myBadges });
    } catch (error) {
      request.log.error(error, '[UserBadgeController.getMyBadges] Failed to get user badges');
      return reply.status(500).send({ success: false, message: 'Failed to get user badges' });
    }
  }
}