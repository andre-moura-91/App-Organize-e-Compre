import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import session from 'express-session';
import { createApp } from '../server/app.js';
import { hashPassword, verifyPassword } from '../server/passwords.js';
import { parseBrazilianCurrency } from '../src/script/currency.js';

const appOrigin = 'http://127.0.0.1:5173';

function createTestApp() {
    const users = [];
    let nextId = 1;
    const pool = {
        query: vi.fn(async (sql, values = []) => {
            if (sql.startsWith('INSERT INTO users')) {
                const [firstName, lastName, email, passwordHash] = values;
                if (users.some((user) => user.email === email)) {
                    const error = new Error('duplicate key');
                    error.code = '23505';
                    throw error;
                }
                const user = { id: nextId++, first_name: firstName, last_name: lastName, email, password_hash: passwordHash };
                users.push(user);
                return { rows: [{ id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email }] };
            }
            if (sql.includes('WHERE email = $1')) {
                return { rows: users.filter((user) => user.email === values[0]) };
            }
            if (sql.includes('WHERE id = $1')) {
                return { rows: users.filter((user) => user.id === values[0]) };
            }
            return { rows: [] };
        })
    };
    const app = createApp({
        pool,
        sessionStore: new session.MemoryStore(),
        appOrigin,
        sessionSecret: 'test-only-session-secret-that-is-long-enough',
        isProduction: false
    });
    return { app, pool, users };
}

async function getCsrf(agent) {
    const response = await agent.get('/api/auth/csrf');
    expect(response.status).toBe(200);
    return response.body.csrfToken;
}

describe('password hashing', () => {
    it('stores a salted scrypt hash and verifies only the matching password', async () => {
        const encoded = await hashPassword('a-long-enough-test-password');
        expect(encoded).not.toContain('a-long-enough-test-password');
        expect(await verifyPassword('a-long-enough-test-password', encoded)).toBe(true);
        expect(await verifyPassword('a-different-password', encoded)).toBe(false);
    });

    it('rejects malformed stored hashes', async () => {
        await expect(verifyPassword('password', 'not-a-valid-hash')).resolves.toBe(false);
    });
});

describe('Brazilian currency parsing', () => {
    it.each([
        ['12,50', 12.5],
        ['R$ 1.234,56', 1234.56],
        ['0', 0]
    ])('parses %s as a numeric amount', (input, expected) => {
        expect(parseBrazilianCurrency(input)).toBe(expected);
    });

    it('rejects malformed or negative values', () => {
        expect(parseBrazilianCurrency('1.234.56')).toBeNull();
        expect(parseBrazilianCurrency('-12,50')).toBeNull();
    });
});

describe('authentication API', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('registers a user without storing a plaintext password and keeps an authenticated session', async () => {
        const { app, users } = createTestApp();
        const agent = request.agent(app);
        const csrfToken = await getCsrf(agent);
        const password = 'a-long-enough-test-password';
        const response = await agent
            .post('/api/auth/register')
            .set('Origin', appOrigin)
            .set('X-CSRF-Token', csrfToken)
            .send({
                firstName: 'Ana',
                lastName: 'Silva',
                email: 'ANA@example.com',
                password
            });

        expect(response.status).toBe(201);
        expect(response.body.user).toMatchObject({ firstName: 'Ana', lastName: 'Silva', email: 'ana@example.com' });
        expect(users[0].password_hash).not.toBe(password);
        expect(await verifyPassword(password, users[0].password_hash)).toBe(true);
        await agent.get('/api/auth/me').expect(200, {
            user: { id: 1, firstName: 'Ana', lastName: 'Silva', email: 'ana@example.com' }
        });
    });

    it('requires a valid origin and CSRF token for registration', async () => {
        const { app } = createTestApp();
        const agent = request.agent(app);
        const csrfToken = await getCsrf(agent);
        const payload = { firstName: 'Ana', lastName: 'Silva', email: 'ana@example.com', password: 'a-long-enough-test-password' };

        await agent.post('/api/auth/register').set('Origin', 'https://attacker.example').set('X-CSRF-Token', csrfToken).send(payload).expect(403);
        await agent.post('/api/auth/register').set('Origin', appOrigin).send(payload).expect(403);
    });

    it('authenticates with the stored hash and can terminate the session', async () => {
        const { app, pool } = createTestApp();
        const agent = request.agent(app);
        const csrfToken = await getCsrf(agent);
        const password = 'a-long-enough-test-password';
        await pool.query(
            'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email',
            ['Ana', 'Silva', 'ana@example.com', await hashPassword(password)]
        );

        await agent.post('/api/auth/login')
            .set('Origin', appOrigin)
            .set('X-CSRF-Token', csrfToken)
            .send({ email: 'ana@example.com', password: 'wrong-password' })
            .expect(401, { error: 'E-mail ou senha inválidos.' });

        await agent.post('/api/auth/login')
            .set('Origin', appOrigin)
            .set('X-CSRF-Token', csrfToken)
            .send({ email: 'ana@example.com', password })
            .expect(200);

        const logoutToken = await getCsrf(agent);
        await agent.post('/api/auth/logout')
            .set('Origin', appOrigin)
            .set('X-CSRF-Token', logoutToken)
            .send({})
            .expect(204);
        await agent.get('/api/auth/me').expect(401);
    });
});
