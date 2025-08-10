import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateBadgeInput, UpdateBadgeInput, GetBadgesQuery } from '@/modules/Badge/interfaces/Badge';

export class BadgeController {
  static async createBadge(request: FastifyRequest<{ Body: CreateBadgeInput }>, reply: FastifyReply) {
    try {
      const newBadge = request.server.repositories.badge.create(request.body);
      await request.server.repositories.badge.save(newBadge);
      return reply.status(201).send({ success: true, data: newBadge });
    } catch (error) {
      request.log.error(error, '[BadgeController.createBadge] Failed to create badge');
      return reply.status(500).send({ success: false, message: 'Failed to create badge' });
    }
  }

  static async getAllBadges(request: FastifyRequest<{ Querystring: GetBadgesQuery }>, reply: FastifyReply) {
    const { categoryIds } = request.query;
    const queryBuilder = request.server.repositories.badge.createQueryBuilder('badge');

    request.log.info(`[getAllBadges] Received request with categoryIds: ${categoryIds}`);

    if (categoryIds && categoryIds.length > 0) {
      const categoryIdFilter = categoryIds.map(id => 
        `(badge.condition::jsonb @> '{"categoryId": ${id}}' OR badge.condition::jsonb @> '{"conditions": [{"categoryId": ${id}}]}')`
      ).join(' OR ');

      const whereClause = `(${categoryIdFilter}) OR (NOT badge.condition::jsonb ? 'categoryId')`;
      queryBuilder.where(whereClause);
      request.log.info(`[getAllBadges] Applying WHERE clause: ${whereClause}`);
    }

    try {
      const [sql, params] = queryBuilder.getQueryAndParameters();
      request.log.info({
        msg: '[getAllBadges] Executing query',
        query: sql,
        parameters: params
      }, 'Executing badge query');

      const badges = await queryBuilder.getMany();

      // 각 뱃지의 condition을 로그로 출력하여 JSON 형식 검증
      badges.forEach(badge => {
        request.log.info(`[getAllBadges] Badge ID: ${badge.id}, Condition: ${badge.condition}`);
      });

      request.log.info(`[getAllBadges] Found ${badges.length} badges.`);

      return reply.status(200).send({
        success: true,
        data: badges,
      });
    } catch (error) {
      request.log.error({
        msg: '[getAllBadges] Error executing query',
        error: error,
        query: queryBuilder.getQuery()
      }, 'Badge query failed');
      
      return reply.status(500).send({
        success: false,
        message: 'Something went wrong while fetching badges.',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  static async updateBadge(request: FastifyRequest<{ Params: { id: number }; Body: UpdateBadgeInput }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const result = await request.server.repositories.badge.update(id, request.body);
      if (result.affected === 0) {
        return reply.status(404).send({ success: false, message: 'Badge not found' });
      }
      const updatedBadge = await request.server.repositories.badge.findOneBy({ id });
      return reply.status(200).send({ success: true, data: updatedBadge });
    } catch (error) {
      request.log.error(error, '[BadgeController.updateBadge] Failed to update badge');
      return reply.status(500).send({ success: false, message: 'Failed to update badge' });
    }
  }

  static async deleteBadge(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const result = await request.server.repositories.badge.delete(id);
      if (result.affected === 0) {
        return reply.status(404).send({ success: false, message: 'Badge not found' });
      }
      return reply.status(204).send();
    } catch (error) {
      request.log.error(error, '[BadgeController.deleteBadge] Failed to delete badge');
      return reply.status(500).send({ success: false, message: 'Failed to delete badge' });
    }
  }
}