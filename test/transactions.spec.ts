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

  it('create new transactions credit', async () => {
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

  it('shold be transaction ID', async () => {
    const createOneTransaction = await request(app.server)
      .post('/transactions')
      .send({ nome: 'Teste', amount: 5000, type: 'credit' })
      .expect(201);

    const cookie = createOneTransaction.get('set-Cookie');

    const listTransactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
      .expect(200);

    const transactionID = listTransactions.body.allTransactions.data[0].id;

    const responseTransaction = await request(app.server)
      .get(`/transactions/${transactionID}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(responseTransaction.body.transaction).toEqual(
      expect.objectContaining({
        nome: 'Teste',
        amount: 5000,
      })
    );
  });

  it('shold be route summary', async () => {
    const createTransactionCredit = await request(app.server)
      .post('/transactions')
      .send({
        nome: 'Teste',
        amount: 500,
        type: 'credit',
      })
      .expect(201);

    const cookie = createTransactionCredit.get('Set-Cookie');

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookie)
      .send({
        nome: 'Teste',
        amount: 200,
        type: 'debit',
      })
      .expect(201);

    const respSummary = await request(app.server)
      .get('/transactions/resume')
      .set('Cookie', cookie)
      .expect(200);
    console.log(respSummary.body.total);
    expect(respSummary.body.total).toEqual(300);
  });
});
