import nodemailer from 'nodemailer';

const EMAIL_SUBJECT = 'New Boutique Customer Enquiry';

export function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function formatSubmissionTimestamp(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: process.env.TIMEZONE || 'Asia/Kolkata',
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

export function buildEnquiryEmailContent(enquiry, submittedAt = new Date()) {
  const formattedDate = formatSubmissionTimestamp(submittedAt);
  const emailDisplay = enquiry.email || 'Not provided';
  const appointmentDisplay = enquiry.appointmentDate || 'Not specified';
  const budgetDisplay = enquiry.budget || 'Not specified';
  const messageDisplay = enquiry.message || 'No additional requirements shared.';

  const text = [
    'New Boutique Customer Enquiry',
    '==============================',
    `Customer Name: ${enquiry.customerName}`,
    `Mobile Number: ${enquiry.mobileNumber}`,
    `Email Address: ${emailDisplay}`,
    `Selected Service: ${enquiry.service}`,
    `Appointment Date: ${appointmentDisplay}`,
    `Budget: ${budgetDisplay}`,
    `Customer Message: ${messageDisplay}`,
    `Submission Date and Time: ${formattedDate}`,
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:24px;background-color:#fbf6f3;font-family:'Segoe UI',Arial,sans-serif;color:#3b2c2a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #ecd9d3;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="background:linear-gradient(135deg,#f5dde0,#f6ebe4);padding:24px 28px;border-bottom:1px solid #e6c7be;">
          <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9f625d;">SuiSaaj Boutique &amp; Tailoring</p>
          <h1 style="margin:0;font-size:22px;font-weight:600;color:#3b2c2a;">New Boutique Customer Enquiry</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="border-collapse:collapse;font-size:14px;">
            <tr style="border-bottom:1px solid #f3e8e4;">
              <td style="width:38%;font-weight:600;color:#7a5652;">Customer Name</td>
              <td>${escapeHtml(enquiry.customerName)}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3e8e4;">
              <td style="font-weight:600;color:#7a5652;">Mobile Number</td>
              <td>${escapeHtml(enquiry.mobileNumber)}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3e8e4;">
              <td style="font-weight:600;color:#7a5652;">Email Address</td>
              <td>${escapeHtml(emailDisplay)}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3e8e4;">
              <td style="font-weight:600;color:#7a5652;">Selected Service</td>
              <td><strong>${escapeHtml(enquiry.service)}</strong></td>
            </tr>
            <tr style="border-bottom:1px solid #f3e8e4;">
              <td style="font-weight:600;color:#7a5652;">Appointment Date</td>
              <td>${escapeHtml(appointmentDisplay)}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3e8e4;">
              <td style="font-weight:600;color:#7a5652;">Budget</td>
              <td>${escapeHtml(budgetDisplay)}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3e8e4;">
              <td style="font-weight:600;color:#7a5652;vertical-align:top;">Customer Message</td>
              <td style="white-space:pre-line;">${escapeHtml(messageDisplay)}</td>
            </tr>
            <tr>
              <td style="font-weight:600;color:#7a5652;">Submission Date &amp; Time</td>
              <td>${escapeHtml(formattedDate)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim();

  return { subject: EMAIL_SUBJECT, text, html, formattedDate };
}

export function createMailerFromEnv(env = process.env) {
  const isMock = env.SMTP_MOCK === 'true';
  const ownerEmail = env.OWNER_EMAIL?.trim();

  if (!ownerEmail && !isMock) {
    return {
      isConfigured: false,
      reason: 'OWNER_EMAIL is not configured.',
    };
  }

  if (isMock) {
    const transporter = nodemailer.createTransport({ jsonTransport: true });
    return {
      isConfigured: true,
      ownerEmail: ownerEmail || 'owner@suisaajboutique.com',
      fromName: env.SMTP_FROM_NAME || 'SuiSaaj Boutique Enquiries',
      fromEmail: env.SMTP_FROM_EMAIL || env.SMTP_USER || 'no-reply@suisaajboutique.com',
      transporter,
    };
  }

  const host = env.SMTP_HOST?.trim();
  const port = Number(env.SMTP_PORT || 465);
  const secure = env.SMTP_SECURE !== undefined ? env.SMTP_SECURE === 'true' : port === 465;
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS;

  if (!host || !user || !pass) {
    return {
      isConfigured: false,
      reason: 'SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) are not configured.',
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  return {
    isConfigured: true,
    ownerEmail,
    fromName: env.SMTP_FROM_NAME || 'SuiSaaj Boutique Enquiries',
    fromEmail: env.SMTP_FROM_EMAIL?.trim() || user,
    transporter,
  };
}

export async function sendEnquiryEmail(mailer, enquiry, submittedAt = new Date()) {
  if (!mailer || !mailer.isConfigured || !mailer.transporter) {
    const err = new Error(mailer?.reason || 'Email service is not configured.');
    err.code = 'SMTP_NOT_CONFIGURED';
    throw err;
  }

  const { subject, text, html } = buildEnquiryEmailContent(enquiry, submittedAt);

  const mailOptions = {
    from: `"${mailer.fromName}" <${mailer.fromEmail}>`,
    to: mailer.ownerEmail,
    subject,
    text,
    html,
  };

  if (enquiry.email) {
    mailOptions.replyTo = enquiry.email;
  }

  const info = await mailer.transporter.sendMail(mailOptions);

  if (Array.isArray(info.rejected) && info.rejected.length > 0) {
    const err = new Error('The mail server rejected the recipient address.');
    err.code = 'SMTP_REJECTED';
    throw err;
  }

  if (!info.messageId) {
    const err = new Error('Email delivery was not confirmed by the mail server.');
    err.code = 'SMTP_UNCONFIRMED';
    throw err;
  }

  return info;
}
