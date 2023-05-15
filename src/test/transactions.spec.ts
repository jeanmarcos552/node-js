import { test, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../config/server';

beforeAll(async () => {
  app.ready();
});

afterAll(async () => {
  app.close();
});

test('Testar credit', async () => {
  await request(app.server)
    .post('/transactions')

    .send({
      nome: 'Teste',
      amount: 5000,
      type: 'credit',
    })
    .expect(201);
});
