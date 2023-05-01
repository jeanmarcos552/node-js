import fastify from 'fastify';
import { knex } from './database';
import { env } from './env';

const app = fastify();

app.get('/', async () => {
  const resKnex = await knex('sqlite_schema').select('*');
  return resKnex;
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('HTTP Server is Running!'));
