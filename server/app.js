import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateEnquiryPayload } from './validation.js';
import { createMailerFromEnv, sendEnquiryEmail } from './mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const DEFAULT_DEDUPE_WINDOW_MS = 60_000;

export function createApp(options = {}) {
  const app = express();
  const mailer = options.mailer ?? createMailerFromEnv(process.env);
  const dedupeWindowMs = options.dedupeWindowMs ?? DEFAULT_DEDUPE_WINDOW_MS;
  const recentSubmissions = new Map();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  const allowedOrigins = (
    process.env.ALLOWED_ORIGIN || 'https://sanjaybeniwal.github.io,http://localhost:5173'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use('/api', (req, res, next) => {
    const requestOrigin = req.headers.origin;
    if (requestOrigin && (allowedOrigins.includes('*') || allowedOrigins.includes(requestOrigin))) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    return next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      emailConfigured: Boolean(mailer?.isConfigured),
    });
  });

  app.post('/api/enquiry', async (req, res) => {
    const validation = validateEnquiryPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Please review the highlighted fields and try again.',
        errors: validation.errors,
      });
    }

    const enquiry = validation.data;
    const now = Date.now();

    // Clean expired dedupe keys
    for (const [key, expiresAt] of recentSubmissions.entries()) {
      if (expiresAt <= now) {
        recentSubmissions.delete(key);
      }
    }

    const clientRequestId =
      typeof req.body?.submissionId === 'string' ? req.body.submissionId.trim() : '';
    const fingerprint = [
      enquiry.mobileNumber.replace(/\D/g, ''),
      enquiry.service,
      enquiry.appointmentDate,
      enquiry.message.toLowerCase(),
    ].join('|');

    if (
      (clientRequestId && recentSubmissions.has(`id:${clientRequestId}`)) ||
      recentSubmissions.has(`fp:${fingerprint}`)
    ) {
      return res.status(409).json({
        success: false,
        message:
          'We have already received this enquiry moments ago. Our boutique team will reach out to you shortly.',
      });
    }

    if (!mailer?.isConfigured) {
      console.error('Enquiry email failed: SMTP not configured.', mailer?.reason);
      return res.status(503).json({
        success: false,
        message:
          'Our email service is currently unavailable. Please reach us directly on WhatsApp or phone.',
      });
    }

    try {
      const info = await sendEnquiryEmail(mailer, enquiry, new Date(now));

      if (dedupeWindowMs > 0) {
        recentSubmissions.set(`fp:${fingerprint}`, now + dedupeWindowMs);
        if (clientRequestId) {
          recentSubmissions.set(`id:${clientRequestId}`, now + dedupeWindowMs);
        }
      }

      return res.status(200).json({
        success: true,
        message:
          'Thank you! Your enquiry has been sent to our boutique team. We will contact you shortly.',
        referenceId: info.messageId,
      });
    } catch (error) {
      console.error('Failed to send enquiry email:', error.message);
      return res.status(502).json({
        success: false,
        message:
          'We could not deliver your enquiry right now. Please try again in a moment or message us on WhatsApp.',
      });
    }
  });

  if (fs.existsSync(DIST_DIR)) {
    app.use(express.static(DIST_DIR));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      return res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
  }

  app.use((err, _req, res, _next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request payload.',
      });
    }
    console.error('Unexpected server error:', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong on our side. Please try again.',
    });
  });

  return app;
}
