import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { z } from 'zod';

export const serviceIds = ['branding', 'social', 'management', 'motion', 'ads', 'web'];
export const budgetIds = ['not-sure', 'under-10k', '10k-25k', '25k-50k', '50k-plus'];
// Reject control characters in email header fields.
// eslint-disable-next-line no-control-regex
const singleLine = (value) => !/[\r\n\u0000-\u001f\u007f]/u.test(value);
const cleanText = (value) =>
  value
    .normalize('NFC')
    .replace(/<[^>]*>/gu, '')
    // Preserve message line breaks while removing non-printing controls.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/gu, '')
    .trim();
const normalizePhone = (value) =>
  value
    .replace(/[٠-٩]/gu, (character) => String(character.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/gu, (character) => String(character.charCodeAt(0) - 1776));
const phoneSchema = z
  .string()
  .trim()
  .max(30)
  .refine(singleLine, 'INVALID_PHONE')
  .transform(normalizePhone)
  .refine(
    (value) => /^[+\d\s().-]+$/u.test(value) && /^\d{8,15}$/u.test(value.replace(/\D/gu, '')),
    'INVALID_PHONE',
  );
const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .refine(singleLine, 'INVALID_NAME')
      .transform(cleanText)
      .refine((value) => value.length >= 2, 'INVALID_NAME'),
    phone: phoneSchema,
    email: z
      .string()
      .trim()
      .max(254)
      .refine(singleLine, 'INVALID_EMAIL')
      .pipe(z.string().email())
      .transform((value) => value.toLowerCase()),
    service: z.enum(serviceIds),
    budget: z.enum(budgetIds).optional().default('not-sure'),
    message: z
      .string()
      .trim()
      .min(10)
      .max(4000)
      .transform(cleanText)
      .refine((value) => value.length >= 10, 'INVALID_MESSAGE'),
    website: z.string().max(200).optional().default(''),
    language: z.enum(['ar', 'en']).optional().default('ar'),
  })
  .strict();

function smtpSettings(env) {
  const required = ['SMTP_HOST', 'CONTACT_TO', 'CONTACT_FROM'];
  if (required.some((name) => !env[name]?.trim())) return null;
  if (Boolean(env.SMTP_USER) !== Boolean(env.SMTP_PASS)) return null;
  if (![env.CONTACT_FROM, env.CONTACT_TO].every(singleLine)) return null;
  const port = Number(env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null;
  return {
    host: env.SMTP_HOST,
    port,
    secure: env.SMTP_SECURE === 'true' || port === 465,
    ...(env.SMTP_USER ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } } : {}),
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    requireTLS: env.SMTP_SECURE !== 'true' && port !== 465,
  };
}

export function createTelegramSender(env, fetchImpl = fetch) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return null;
  return async (lead) => {
    const response = await fetchImpl(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: leadText(lead),
          link_preview_options: { is_disabled: true },
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!response.ok) throw new Error('TELEGRAM_DELIVERY_FAILED');
    const result = await response.json();
    if (!result.ok) throw new Error('TELEGRAM_DELIVERY_FAILED');
  };
}

function leadText(lead) {
  return [
    'BLUE — New project enquiry',
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Service: ${lead.service}`,
    `Budget: ${lead.budget}`,
    `Language: ${lead.language || 'ar'}`,
    '',
    'Project message:',
    lead.message,
  ].join('\n');
}

export function createApp({
  env = process.env,
  mailer,
  telegramSender,
  logger = console,
  rateLimitOptions = {},
  serveStatic = env.NODE_ENV === 'production',
  staticDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist'),
} = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(compression());
  if (env.TRUST_PROXY && /^\d+$/u.test(env.TRUST_PROXY))
    app.set('trust proxy', Number(env.TRUST_PROXY));
  app.use(
    helmet({
      contentSecurityPolicy:
        env.NODE_ENV === 'production'
          ? {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'blob:'],
                fontSrc: ["'self'"],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                frameAncestors: ["'none'"],
                upgradeInsecureRequests: null,
              },
            }
          : false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  const allowedOrigins = (
    env.CLIENT_ORIGIN ||
    (env.NODE_ENV === 'production' ? '' : 'http://localhost:5173,http://127.0.0.1:5173')
  )
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  app.use('/api', (request, response, next) =>
    cors({
      origin(origin, callback) {
        const sameOrigin = origin === `${request.protocol}://${request.get('host')}`;
        if (!origin || sameOrigin || allowedOrigins.includes(origin)) return callback(null, true);
        const error = new Error('ORIGIN_NOT_ALLOWED');
        error.status = 403;
        return callback(error);
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      maxAge: 600,
    })(request, response, next),
  );
  app.use('/api', express.json({ limit: '16kb' }));
  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_request, response) =>
      response.status(429).json({ success: false, error: 'RATE_LIMITED' }),
    ...rateLimitOptions,
  });
  const settings = smtpSettings(env);
  const transport = mailer || (settings ? nodemailer.createTransport(settings) : null);
  const sendTelegram = telegramSender || createTelegramSender(env);

  app.post('/api/contact', limiter, async (request, response) => {
    if (!request.is('application/json'))
      return response.status(415).json({ success: false, error: 'INVALID_CONTENT_TYPE' });
    // Bots get the same neutral acknowledgement, without generating a real lead.
    if (typeof request.body?.website === 'string' && request.body.website.trim())
      return response.json({ success: true, delivery: 'accepted' });
    const parsed = contactSchema.safeParse(request.body);
    if (!parsed.success) {
      const fields = Object.fromEntries(
        parsed.error.issues.map((issue) => [issue.path[0] || 'form', 'INVALID_FIELD']),
      );
      return response.status(400).json({ success: false, error: 'VALIDATION_ERROR', fields });
    }
    const { website: _honeypot, ...lead } = parsed.data;
    if (!transport) {
      if (env.NODE_ENV === 'production')
        return response.status(503).json({ success: false, error: 'DELIVERY_UNAVAILABLE' });
      // Development-only lead logging is explicit; never print SMTP or bot configuration.
      logger.info('[BLUE contact — development only; no email sent]', lead);
      return response.json({ success: true, delivery: 'development' });
    }
    try {
      await transport.sendMail({
        from: env.CONTACT_FROM,
        to: env.CONTACT_TO,
        replyTo: { name: lead.name, address: lead.email },
        subject: `BLUE project enquiry — ${lead.service}`,
        text: leadText(lead),
        disableFileAccess: true,
        disableUrlAccess: true,
      });
    } catch {
      logger.error('[BLUE contact] Email delivery failed. Check the server SMTP configuration.');
      return response.status(502).json({ success: false, error: 'DELIVERY_FAILED' });
    }
    if (sendTelegram) {
      try {
        await sendTelegram(lead);
        return response.json({ success: true, delivery: 'email-and-telegram' });
      } catch {
        // The email is already accepted. Retrying the entire form would create duplicates.
        logger.warn('[BLUE contact] Email accepted; optional Telegram delivery failed.');
      }
    }
    return response.json({ success: true, delivery: 'email' });
  });

  app.use('/api', (_request, response) =>
    response.status(404).json({ success: false, error: 'NOT_FOUND' }),
  );
  if (serveStatic && existsSync(path.join(staticDirectory, 'index.html'))) {
    app.use(express.static(staticDirectory, { maxAge: '1h', index: false }));
    app.get(/.*/, (request, response, next) => {
      if (path.extname(request.path)) return next();
      response.setHeader('Cache-Control', 'no-cache');
      return response.sendFile(path.join(staticDirectory, 'index.html'));
    });
  }
  app.use((error, _request, response, _next) => {
    if (error.status === 403)
      return response.status(403).json({ success: false, error: 'ORIGIN_NOT_ALLOWED' });
    if (error.type === 'entity.too.large')
      return response.status(413).json({ success: false, error: 'PAYLOAD_TOO_LARGE' });
    if (error.type === 'entity.parse.failed')
      return response.status(400).json({ success: false, error: 'INVALID_JSON' });
    logger.error('[BLUE server] Unexpected request failure.');
    return response.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  });
  return app;
}
