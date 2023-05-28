import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Teste Routes transactions', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Testar credit', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        nome: 'Teste',
        amount: 5000,
        type: 'credit',
      })
      .expect(201);
  });

  it('List all transactions', async () => {
    const cookiesLoged = await request(app.server)
      .post('/transactions')
      .send({
        nome: 'Teste',
        amount: 5000,
        type: 'credit',
      })
      .expect(201);

    const listAllTransaction = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookiesLoged.get('set-cookie'))
      .expect(200);

    expect(listAllTransaction.body.allTransactions.data).toEqual([
      expect.objectContaining({
        nome: 'Teste',
        amount: 5000,
      }),
    ]);
  });
});
