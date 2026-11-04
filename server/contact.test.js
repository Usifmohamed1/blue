import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { createApp, createTelegramSender } from './app.js';

const quiet = { info() {}, warn() {}, error() {} };
const validLead = {
  name: 'Nour Ahmed',
  phone: '+20 100 123 4567',
  email: 'nour@example.com',
  service: 'branding',
  budget: '10k-25k',
  message: 'We need a complete visual identity for a new cafe.',
  website: '',
};
const makeApp = (options) =>
  createApp({ env: { NODE_ENV: 'test' }, logger: quiet, serveStatic: false, ...options });

test('development returns a clearly marked local acknowledgement and logs no server secrets', async () => {
  const logs = [];
  const app = makeApp({
    env: { NODE_ENV: 'development', SMTP_PASS: 'must-not-appear-in-logs' },
    logger: { ...quiet, info: (...args) => logs.push(args) },
  });
  const response = await request(app).post('/api/contact').send(validLead).expect(200);
  assert.equal(response.body.delivery, 'development');
  assert.equal(logs[0][1].name, validLead.name);
  assert.equal(JSON.stringify(logs).includes('must-not-appear'), false);
});

test('invalid contact fields and header injection cannot reach the mailer', async () => {
  let sends = 0;
  const app = makeApp({
    mailer: {
      async sendMail() {
        sends++;
      },
    },
  });
  const response = await request(app)
    .post('/api/contact')
    .send({
      ...validLead,
      name: 'Nour\r\nBcc: other@example.com',
      phone: 'no phone',
      email: 'invalid',
      service: 'unknown',
      message: 'short',
    })
    .expect(400);
  assert.equal(response.body.error, 'VALIDATION_ERROR');
  assert.deepEqual(Object.keys(response.body.fields).sort(), [
    'email',
    'message',
    'name',
    'phone',
    'service',
  ]);
  assert.equal(sends, 0);
});

test('honeypot quietly acknowledges bots without logging or delivering', async () => {
  let sends = 0;
  const app = makeApp({
    mailer: {
      async sendMail() {
        sends++;
      },
    },
  });
  const response = await request(app)
    .post('/api/contact')
    .send({ website: 'https://spam.invalid' })
    .expect(200);
  assert.equal(response.body.delivery, 'accepted');
  assert.equal(sends, 0);
});

test('production requires configured email delivery rather than claiming a lead was sent', async () => {
  const app = makeApp({ env: { NODE_ENV: 'production' } });
  const response = await request(app).post('/api/contact').send(validLead).expect(503);
  assert.equal(response.body.error, 'DELIVERY_UNAVAILABLE');
});

test('valid leads are normalized and delivered as plain text with a structured reply-to', async () => {
  let email;
  const app = makeApp({
    env: {
      NODE_ENV: 'production',
      CONTACT_FROM: 'blue@example.com',
      CONTACT_TO: 'owner@example.com',
    },
    mailer: {
      async sendMail(value) {
        email = value;
      },
    },
  });
  const response = await request(app)
    .post('/api/contact')
    .send({
      ...validLead,
      name: ' <b>Nour</b> ',
      email: 'NOUR@example.com',
      phone: '٠١٠١٢٣٤٥٦٧٨',
      message: '<script>alert(1)</script> Please help with a cafe identity.',
    })
    .expect(200);
  assert.equal(response.body.delivery, 'email');
  assert.deepEqual(email.replyTo, { name: 'Nour', address: 'nour@example.com' });
  assert.match(email.text, /Phone: 01012345678/);
  assert.doesNotMatch(email.text, /<script>|<b>/);
  assert.equal(email.html, undefined);
  assert.equal(email.disableFileAccess, true);
  assert.equal(email.disableUrlAccess, true);
});

test('SMTP errors report failure and skip optional Telegram delivery', async () => {
  let telegramCalls = 0;
  const app = makeApp({
    mailer: {
      async sendMail() {
        throw new Error('SMTP error containing credentials');
      },
    },
    telegramSender: async () => {
      telegramCalls++;
    },
  });
  const response = await request(app).post('/api/contact').send(validLead).expect(502);
  assert.equal(response.body.error, 'DELIVERY_FAILED');
  assert.equal(telegramCalls, 0);
  assert.equal(JSON.stringify(response.body).includes('credentials'), false);
});

test('optional Telegram errors do not turn accepted email into a failed lead', async () => {
  const app = makeApp({
    mailer: { async sendMail() {} },
    telegramSender: async () => {
      throw new Error('Bot unavailable');
    },
  });
  const response = await request(app).post('/api/contact').send(validLead).expect(200);
  assert.equal(response.body.delivery, 'email');
});

test('both configured notification channels can acknowledge delivery', async () => {
  let telegramLead;
  const app = makeApp({
    mailer: { async sendMail() {} },
    telegramSender: async (lead) => {
      telegramLead = lead;
    },
  });
  const response = await request(app).post('/api/contact').send(validLead).expect(200);
  assert.equal(response.body.delivery, 'email-and-telegram');
  assert.equal(telegramLead.email, validLead.email);
});

test('rate limiting rejects excess lead submissions', async () => {
  const app = makeApp({ rateLimitOptions: { limit: 1 } });
  await request(app).post('/api/contact').send(validLead).expect(200);
  const response = await request(app).post('/api/contact').send(validLead).expect(429);
  assert.equal(response.body.error, 'RATE_LIMITED');
  assert.ok(response.headers['ratelimit']);
});

test('CORS allows configured frontend origins and rejects unlisted origins', async () => {
  const app = makeApp({
    env: { NODE_ENV: 'production', CLIENT_ORIGIN: 'https://blue.example.com' },
  });
  const good = await request(app)
    .get('/api/health')
    .set('Origin', 'https://blue.example.com')
    .expect(200);
  assert.equal(good.headers['access-control-allow-origin'], 'https://blue.example.com');
  const blocked = await request(app)
    .post('/api/contact')
    .set('Origin', 'https://untrusted.example.com')
    .send(validLead)
    .expect(403);
  assert.equal(blocked.body.error, 'ORIGIN_NOT_ALLOWED');
  assert.equal(blocked.headers['access-control-allow-origin'], undefined);
});

test('malformed JSON and oversized requests return bounded errors', async () => {
  const app = makeApp();
  const malformed = await request(app)
    .post('/api/contact')
    .set('Content-Type', 'application/json')
    .send('{')
    .expect(400);
  assert.equal(malformed.body.error, 'INVALID_JSON');
  const oversized = await request(app)
    .post('/api/contact')
    .send({ ...validLead, message: 'a'.repeat(20_000) })
    .expect(413);
  assert.equal(oversized.body.error, 'PAYLOAD_TOO_LARGE');
});

test('API health and unknown endpoints do not expose configuration or fall back to HTML', async () => {
  const app = makeApp({ env: { SMTP_PASS: 'secret', TELEGRAM_BOT_TOKEN: 'secret' } });
  assert.deepEqual((await request(app).get('/api/health').expect(200)).body, { status: 'ok' });
  const missing = await request(app).get('/api/not-a-route').expect(404);
  assert.equal(missing.body.error, 'NOT_FOUND');
});

test('Telegram uses its server-side token and text-only payload without leaking failures', async () => {
  let call;
  const sender = createTelegramSender(
    { TELEGRAM_BOT_TOKEN: 'test-token', TELEGRAM_CHAT_ID: 'test-chat' },
    async (...args) => {
      call = args;
      return {
        ok: true,
        async json() {
          return { ok: true };
        },
      };
    },
  );
  await sender(validLead);
  assert.equal(call[0], 'https://api.telegram.org/bottest-token/sendMessage');
  const payload = JSON.parse(call[1].body);
  assert.equal(payload.chat_id, 'test-chat');
  assert.equal(payload.parse_mode, undefined);
  assert.match(payload.text, /Nour Ahmed/);
});

test('production serves frontend routes while preserving real API and asset errors', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'blue-api-static-'));
  try {
    await writeFile(path.join(directory, 'index.html'), '<!doctype html><title>BLUE app</title>');
    const app = makeApp({
      env: { NODE_ENV: 'production' },
      serveStatic: true,
      staticDirectory: directory,
    });
    const page = await request(app).get('/work/a-concept-project').expect(200);
    assert.match(page.text, /BLUE app/);
    assert.match(page.headers['content-security-policy'], /script-src 'self'/);
    assert.equal(page.headers['cache-control'], 'no-cache');
    await request(app).get('/assets/missing.js').expect(404);
    const api = await request(app).get('/api/missing').expect(404);
    assert.equal(api.body.error, 'NOT_FOUND');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('non-JSON content is rejected before delivery', async () => {
  const app = makeApp();
  const response = await request(app).post('/api/contact').type('form').send(validLead).expect(415);
  assert.equal(response.body.error, 'INVALID_CONTENT_TYPE');
});
