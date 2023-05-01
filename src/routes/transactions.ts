import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';
import { z } from 'zod';

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const { body } = req;

    const schemaValidation = z.object({
      nome: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const { amount, type, nome } = schemaValidation.parse(body);

    await knex('transactions').insert({
      id: randomUUID(),
      nome,
      amount: type === 'credit' ? amount : amount * -1,
    });

    return res.status(201).send();
  });

  app.get('/', async () => {
    return await knex('transactions').select('*');
  });
}
