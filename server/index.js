import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import pg from 'pg';
import { createApp, createSessionStore } from './app.js';

const { Pool } = pg;
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '127.0.0.1';
const sessionSecret = process.env.SESSION_SECRET;
const appOrigin = process.env.APP_ORIGIN;
const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.DATABASE_URL || !sessionSecret || sessionSecret.length < 32 || !appOrigin) {
  throw new Error('Configure DATABASE_URL, APP_ORIGIN, and SESSION_SECRET (at least 32 characters).');
}

const parsedOrigin = new URL(appOrigin);
if (parsedOrigin.origin !== appOrigin || (isProduction && parsedOrigin.protocol !== 'https:')) {
  throw new Error('APP_ORIGIN must be an origin without a trailing slash; production must use HTTPS.');
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
await pool.query(schema);

const app = createApp({
  pool,
  sessionStore: createSessionStore(pool),
  appOrigin,
  sessionSecret,
  isProduction,
  staticDirectory: isProduction ? resolve('dist') : undefined
});

const server = app.listen(port, host, () => {
  console.log(`Organize & Compre API available at http://${host}:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  });
}
