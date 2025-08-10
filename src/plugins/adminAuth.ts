import { FastifyRequest, FastifyReply } from 'fastify';
import { config } from '@/config/env';

export const adminAuthHook = async (request: FastifyRequest, reply: FastifyReply) => {
  // @ts-ignore
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ message: 'Authentication required' });
  }

  if (!config.adminUserIds.includes(userId)) {
    return reply.status(403).send({ message: 'Forbidden: Administrator access required' });
  }
};
