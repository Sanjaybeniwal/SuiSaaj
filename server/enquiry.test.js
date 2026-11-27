import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from './app.js';
import { buildEnquiryEmailContent } from './mailer.js';
import { validateEnquiryPayload } from './validation.js';

function startTestServer(app) {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

test('validateEnquiryPayload rejects missing required fields and invalid formats', () => {
  const result = validateEnquiryPayload({
    customerName: '',
    mobileNumber: '12345',
    email: 'invalid-email',
    service: 'Unknown Service',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.customerName);
  assert.ok(result.errors.mobileNumber);
  assert.ok(result.errors.email);
  assert.ok(result.errors.service);
});

test('validateEnquiryPayload accepts valid payload with optional fields omitted', () => {
  const result = validateEnquiryPayload({
    customerName: 'Ananya Sharma',
    mobileNumber: '+91 98765 43210',
    email: '',
    service: 'Blouse Stitching',
    appointmentDate: '',
    budget: '',
    message: '',
  });

  assert.equal(result.valid, true);
  assert.equal(result.data.customerName, 'Ananya Sharma');
  assert.equal(result.data.service, 'Blouse Stitching');
});

test('buildEnquiryEmailContent includes required subject, all fields, and escapes HTML', () => {
  const { subject, text, html } = buildEnquiryEmailContent(
    {
      customerName: 'Meera <script>alert(1)</script>',
      mobileNumber: '9876543210',
      email: 'meera@example.com',
      service: 'Bridal Wear',
      appointmentDate: '2026-12-10',
      budget: '₹8,000 – ₹20,000',
      message: 'Need custom zardozi blouse & lehenga fitting.',
    },
    new Date('2026-11-27T12:00:00.000Z')
  );

  assert.equal(subject, 'New Boutique Customer Enquiry');
  assert.match(text, /Customer Name: Meera <script>alert\(1\)<\/script>/);
  assert.match(text, /Mobile Number: 9876543210/);
  assert.match(text, /Email Address: meera@example\.com/);
  assert.match(text, /Selected Service: Bridal Wear/);
  assert.match(text, /Appointment Date: 2026-12-10/);
  assert.match(text, /Budget: ₹8,000 – ₹20,000/);
  assert.match(text, /Customer Message: Need custom zardozi blouse & lehenga fitting\./);
  assert.match(text, /Submission Date and Time:/);

  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});

test('POST /api/enquiry sends email when transporter accepts and blocks duplicate submissions', async () => {
  const sentMails = [];
  const fakeMailer = {
    isConfigured: true,
    ownerEmail: 'owner@suisaaj.test',
    fromName: 'SuiSaaj',
    fromEmail: 'no-reply@suisaaj.test',
    transporter: {
      async sendMail(mailOptions) {
        sentMails.push(mailOptions);
        return { messageId: '<msg-123@suisaaj.test>', accepted: [mailOptions.to], rejected: [] };
      },
    },
  };

  const app = createApp({ mailer: fakeMailer, dedupeWindowMs: 60_000 });
  const { server, baseUrl } = await startTestServer(app);

  try {
    const payload = {
      customerName: 'Priya Verma',
      mobileNumber: '9811223344',
      email: 'priya@example.com',
      service: 'Suit Stitching',
      appointmentDate: '2026-12-05',
      budget: '₹1,500 – ₹3,500',
      message: 'Anarkali suit with organza dupatta.',
      submissionId: 'sub-001',
    };

    const res1 = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body1 = await res1.json();

    assert.equal(res1.status, 200);
    assert.equal(body1.success, true);
    assert.equal(sentMails.length, 1);
    assert.equal(sentMails[0].to, 'owner@suisaaj.test');
    assert.equal(sentMails[0].subject, 'New Boutique Customer Enquiry');
    assert.equal(sentMails[0].replyTo, 'priya@example.com');

    // Duplicate submission should be blocked without sending a second email
    const res2 = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body2 = await res2.json();

    assert.equal(res2.status, 409);
    assert.equal(body2.success, false);
    assert.equal(sentMails.length, 1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /api/enquiry returns error when SMTP fails to deliver', async () => {
  const failingMailer = {
    isConfigured: true,
    ownerEmail: 'owner@suisaaj.test',
    fromName: 'SuiSaaj',
    fromEmail: 'no-reply@suisaaj.test',
    transporter: {
      async sendMail() {
        throw new Error('SMTP connection refused');
      },
    },
  };

  const app = createApp({ mailer: failingMailer });
  const { server, baseUrl } = await startTestServer(app);

  try {
    const res = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Kavita Rao',
        mobileNumber: '9988776655',
        service: 'Kurti Stitching',
      }),
    });
    const body = await res.json();

    assert.equal(res.status, 502);
    assert.equal(body.success, false);
    assert.ok(body.message);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
