import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';
import { attachPaginate } from 'knex-paginate';
import { number, string, z } from 'zod';
import { checkIsCookie } from '../middlewares';

attachPaginate();

export async function transactionsRoutes(app: FastifyInstance) {
  const preHandler = {
    preHandler: checkIsCookie,
  };

  /* 
    Create
  */
  app.post('/', preHandler, async (req, res) => {
    const { body } = req;

    const schemaValidation = z.object({
      nome: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const { amount, type, nome } = schemaValidation.parse(body);

    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = randomUUID();

      res.cookie('sessionId', sessionId, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex('transactions').insert({
      id: randomUUID(),
      nome,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    });

    return res.status(201).send();
  });

  /* 
  List All
  */
  app.get('/', preHandler, async (req) => {
    const { query, cookies } = req;

    const creatSchema = z.object({
      prevPage: number().nullable().default(1),
      perPage: number().nullable().default(10),
    });

    const { prevPage, perPage } = creatSchema.parse(query);

    const allTransactions = await knex('transactions')
      .where('session_id', cookies.sessionId)
      .paginate({
        currentPage: prevPage || 1,
        perPage: perPage || 10,
      });
    return { allTransactions };
  });

  /* 
   By ID
  */
  app.get('/:id', preHandler, async (req) => {
    const { params, cookies } = req;

    const createSchema = z.object({
      id: string().uuid(),
    });

    const { id } = createSchema.parse(params);

    const transaction = await knex('transactions')
      .where({
        id,
        session_id: cookies.sessionId,
      })
      .select('*')
      .first();

    return { transaction };
  });

  /* 
  Resume
  */
  app.get('/resume', preHandler, async (req) => {
    const { sessionId } = req.cookies;

    const transaction = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount as total')
      .first();

    // const saldo = transaction.reduce((previousValue, currentValue) => {
    //   return +(previousValue += currentValue.amount).toFixed(2);
    // }, 0);

    return transaction;
  });
}
