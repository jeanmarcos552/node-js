import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

app.get('/', async () => {
  const resKnex = await knex('sqlite_schema').select('*');
  return resKnex;
});

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('HTTP Server is Running!'));
