import { FastifyRequest, FastifyReply } from 'fastify';
import { AcquireBadgeInput, UpdateEquippedBadgesInput } from '@/modules/UserBadge/interfaces/UserBadge';

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

  static async getEquippedBadges(request: FastifyRequest, reply: FastifyReply) {
    try {
      // @ts-ignore
      const userId = request.user.id;
      const user = await request.server.repositories.user.findOneBy({ id: userId });
      if (!user) {
        return reply.status(404).send({ success: false, message: 'User not found' });
      }
      return reply.status(200).send({ success: true, data: user.equippedBadgeIds });
    } catch (error) {
      request.log.error(error, '[UserBadgeController.getEquippedBadges] Failed to get equipped badges');
      return reply.status(500).send({ success: false, message: 'Failed to get equipped badges' });
    }
  }

  static async updateEquippedBadges(request: FastifyRequest<{ Body: UpdateEquippedBadgesInput }>, reply: FastifyReply) {
    try {
      // @ts-ignore
      const userId = request.user.id;
      const { badgeIds } = request.body;

      // Verify that the user has acquired all the badges they are trying to equip
      const userBadges = await request.server.repositories.userBadge.find({ where: { userId } });
      const userBadgeIds = userBadges.map(ub => ub.badgeId);
      const canEquip = badgeIds.every(id => userBadgeIds.includes(id));

      if (!canEquip) {
        return reply.status(400).send({ success: false, message: 'User has not acquired all badges to be equipped' });
      }

      await request.server.repositories.user.update(userId, { equippedBadgeIds: badgeIds });
      return reply.status(200).send({ success: true, data: { equippedBadgeIds: badgeIds } });
    } catch (error) {
      request.log.error(error, '[UserBadgeController.updateEquippedBadges] Failed to update equipped badges');
      return reply.status(500).send({ success: false, message: 'Failed to update equipped badges' });
    }
  }
}