import { env } from './env';
import app from './config/server';

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('HTTP Server is Running!'));
