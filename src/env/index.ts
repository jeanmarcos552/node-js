import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  DATABASE_CLIENTE: z.enum(['sqlite', 'pg']),
});

const _env = schema.safeParse(process.env);

if (_env.success !== true) {
  console.error('Invalid environment variables!', _env.error.format());

  throw new Error('Invalid environment variables');
}

export const env = _env.data;
