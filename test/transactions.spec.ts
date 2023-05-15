import { test, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test('Testar credit', async () => {
  await request(app.server)
    .post('/transactions')
    .set('Cookie', [
      'sessionId=88635993-7830-4eee-9b56-449ced1457fd; Max-Age=604800000; Path=/; Domain=localhost',
    ])
    .send({
      nome: 'Teste',
      amount: 5000,
      type: 'credit',
    })
    .expect(201);
});
