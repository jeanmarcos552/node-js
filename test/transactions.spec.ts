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

  it('shold be able all transactions', async () => {
    const create = await request(app.server)
      .post('/transactions')
      .send({
        nome: 'Teste transaction',
        amount: 1000,
        type: 'credit',
      })
      .expect(201);

    const cookieAuthenticate = create.get('Set-Cookie');

    const respList = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookieAuthenticate)
      .expect(200);

    expect(respList.body.allTransactions.data).toEqual([
      expect.objectContaining({
        nome: 'Teste transaction',
        amount: 1000,
      }),
    ]);
  });
});
