import { randomBytes, timingSafeEqual } from 'node:crypto';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { hashPassword, verifyPassword } from './passwords.js';

const PgSession = connectPgSimple(session);
const loginError = 'E-mail ou senha inválidos.';
const dummyHashPromise = hashPassword('invalid-login-sentinel');

function publicUser(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email
  };
}

function validEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function matchesToken(value, expected) {
  if (typeof value !== 'string' || typeof expected !== 'string') return false;
  const provided = Buffer.from(value);
  const token = Buffer.from(expected);
  return provided.length === token.length && timingSafeEqual(provided, token);
}

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
}

function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => (error ? reject(error) : resolve()));
  });
}

export function createApp({ pool, sessionStore, appOrigin, sessionSecret, isProduction = false, staticDirectory }) {
  if (!pool || !sessionStore || !appOrigin || !sessionSecret) {
    throw new Error('Pool, session store, app origin, and session secret are required.');
  }

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', isProduction ? 1 : false);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com', 'data:'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"]
      }
    }
  }));
  app.use(express.json({ limit: '10kb' }));
  app.use(session({
    name: 'organize.sid',
    store: sessionStore,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 8 * 60 * 60 * 1000
    }
  }));

  app.get('/api/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok' });
    } catch (error) {
      console.error('Health check failed:', error.code ?? 'database error');
      res.status(503).json({ error: 'Serviço temporariamente indisponível.' });
    }
  });

  app.get('/api/auth/csrf', (req, res) => {
    req.session.csrfToken ??= randomBytes(32).toString('hex');
    res.set('Cache-Control', 'no-store');
    res.json({ csrfToken: req.session.csrfToken });
  });

  const sameOrigin = (req, res, next) => {
    if (req.get('origin') !== appOrigin) {
      return res.status(403).json({ error: 'Requisição não autorizada.' });
    }
    if (!matchesToken(req.get('x-csrf-token'), req.session.csrfToken)) {
      return res.status(403).json({ error: 'Sessão expirada. Atualize a página e tente novamente.' });
    }
    next();
  };

  const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' }
  });

  app.post('/api/auth/register', authRateLimit, sameOrigin, async (req, res) => {
    const firstName = typeof req.body.firstName === 'string' ? req.body.firstName.trim() : '';
    const lastName = typeof req.body.lastName === 'string' ? req.body.lastName.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (
      !firstName || firstName.length > 80 ||
      !lastName || lastName.length > 80 ||
      !validEmail(email) ||
      password.length < 12 || Buffer.byteLength(password, 'utf8') > 128
    ) {
      return res.status(400).json({
        error: 'Informe nome, sobrenome, e-mail válido e uma senha de 12 a 128 bytes.'
      });
    }

    try {
      const passwordHash = await hashPassword(password);
      const { rows } = await pool.query(
        'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email',
        [firstName, lastName, email, passwordHash]
      );
      const user = publicUser(rows[0]);
      await regenerateSession(req);
      req.session.userId = user.id;
      res.status(201).json({ user });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Não foi possível criar a conta. Verifique os dados ou tente entrar.' });
      }
      console.error('Account registration failed:', error.code ?? 'database error');
      res.status(500).json({ error: 'Não foi possível concluir o cadastro. Tente novamente.' });
    }
  });

  app.post('/api/auth/login', authRateLimit, sameOrigin, async (req, res) => {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!validEmail(email) || !password || Buffer.byteLength(password, 'utf8') > 128) {
      await verifyPassword(password, await dummyHashPromise);
      return res.status(401).json({ error: loginError });
    }

    try {
      const { rows } = await pool.query(
        'SELECT id, first_name, last_name, email, password_hash FROM users WHERE email = $1',
        [email]
      );
      const row = rows[0];
      const matches = await verifyPassword(password, row?.password_hash ?? await dummyHashPromise);
      if (!row || !matches) return res.status(401).json({ error: loginError });

      const user = publicUser(row);
      await regenerateSession(req);
      req.session.userId = user.id;
      res.json({ user });
    } catch (error) {
      console.error('Login failed:', error.code ?? 'database error');
      res.status(500).json({ error: 'Não foi possível entrar. Tente novamente.' });
    }
  });

  app.get('/api/auth/me', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Autenticação necessária.' });
    try {
      const { rows } = await pool.query(
        'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
        [req.session.userId]
      );
      if (!rows[0]) {
        await destroySession(req);
        res.clearCookie('organize.sid', { httpOnly: true, sameSite: 'lax', secure: isProduction });
        return res.status(401).json({ error: 'Autenticação necessária.' });
      }
      res.set('Cache-Control', 'no-store');
      res.json({ user: publicUser(rows[0]) });
    } catch (error) {
      console.error('Session lookup failed:', error.code ?? 'database error');
      res.status(500).json({ error: 'Não foi possível verificar a sessão.' });
    }
  });

  app.post('/api/auth/logout', sameOrigin, async (req, res) => {
    try {
      await destroySession(req);
      res.clearCookie('organize.sid', { httpOnly: true, sameSite: 'lax', secure: isProduction });
      res.status(204).end();
    } catch (error) {
      console.error('Logout failed:', error.code ?? 'session error');
      res.status(500).json({ error: 'Não foi possível encerrar a sessão.' });
    }
  });

  app.use('/api', (_req, res) => res.status(404).json({ error: 'Recurso não encontrado.' }));

  if (staticDirectory) {
    app.use(express.static(staticDirectory, { index: 'index.html' }));
    app.get('*path', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile('index.html', { root: staticDirectory }, (error) => {
        if (error) next(error);
      });
    });
  }

  app.use((error, _req, res, _next) => {
    console.error('Unhandled request error:', error.status ?? 'request error');
    res.status(500).json({ error: 'Ocorreu um erro inesperado.' });
  });

  return app;
}

export function createSessionStore(pool) {
  return new PgSession({ pool, tableName: 'user_sessions', createTableIfMissing: true });
}
