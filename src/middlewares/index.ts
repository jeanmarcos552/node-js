import { FastifyRequest } from 'fastify/types/request';
import { FastifyReply } from 'fastify/types/reply';

export async function checkIsCookie(req: FastifyRequest, res: FastifyReply) {
  const { cookies } = req;

  if (!cookies.sessionId) {
    res.status(403).send({ error: 'Unauthenticated!' });
  }
}
