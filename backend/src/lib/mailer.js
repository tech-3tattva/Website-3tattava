/**
 * Outbound email.
 *
 * One transport, created once. The existing code builds a fresh SESClient inside
 * each request handler, which is what produces the
 * "MaxListenersExceededWarning: 11 uncaughtException listeners" in the pm2 logs
 * and leaks a little memory on every order.
 *
 * Three routes, chosen by what is configured, so the same code path can be
 * exercised locally without production credentials:
 *
 *   SES    - AWS_ACCESS_KEY_ID + AWS_SES_FROM_EMAIL present (production)
 *   SMTP   - SMTP_HOST + SMTP_USER + SMTP_PASS present (a throwaway mailbox,
 *            or an app password, for testing real delivery)
 *   capture - neither configured: writes the message to disk and returns the
 *            path instead of pretending to send. Never silently swallows mail.
 */

const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const templates = require("./emailTemplates");

const CAPTURE_DIR = process.env.MAIL_CAPTURE_DIR || "/tmp/3tattava-mail";

let sesClient = null;
let smtpTransport = null;

function mode() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) return "smtp";
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SES_FROM_EMAIL) return "ses";
  return "capture";
}

function fromAddress() {
  return (
    process.env.MAIL_FROM ||
    process.env.AWS_SES_FROM_EMAIL ||
    "3TATTAVA <support@3tattava.com>"
  );
}

/** Built once and reused; see the note above about per-request clients. */
function getSes() {
  if (!sesClient) {
    const { SESClient } = require("@aws-sdk/client-ses");
    sesClient = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return sesClient;
}

function getSmtp() {
  if (!smtpTransport) {
    smtpTransport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return smtpTransport;
}

/**
 * Sends one message.
 *
 * `attachments` is nodemailer's shape. SES's plain SendEmailCommand cannot carry
 * attachments, so when one is present the message is built with nodemailer and
 * handed to SES as raw MIME.
 */
async function send({ to, subject, text, html, attachments = [] }) {
  if (!to) throw new Error("Email has no recipient");
  const active = mode();

  if (active === "capture") {
    fs.mkdirSync(CAPTURE_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safe = String(subject).replace(/[^a-z0-9]+/gi, "-").slice(0, 60);
    const file = path.join(CAPTURE_DIR, `${stamp}--${safe}.html`);
    fs.writeFileSync(
      file,
      `<!-- to: ${to}\n     subject: ${subject}\n     attachments: ${attachments
        .map((a) => a.filename)
        .join(", ") || "none"} -->\n${html || `<pre>${text}</pre>`}`,
    );
    for (const a of attachments) {
      if (a.content) fs.writeFileSync(path.join(CAPTURE_DIR, `${stamp}--${a.filename}`), a.content);
    }
    return { mode: "capture", to, file };
  }

  if (active === "smtp") {
    const info = await getSmtp().sendMail({ from: fromAddress(), to, subject, text, html, attachments });
    return { mode: "smtp", to, messageId: info.messageId, accepted: info.accepted };
  }

  const { SendRawEmailCommand, SendEmailCommand } = require("@aws-sdk/client-ses");
  if (attachments.length) {
    // Raw MIME so the invoice can ride along as a real attachment.
    const built = await nodemailer
      .createTransport({ streamTransport: true, buffer: true })
      .sendMail({ from: fromAddress(), to, subject, text, html, attachments });
    // Keep the MessageId: it is the only handle for tracing a delivery
    // complaint or bounce back to a specific invoice later.
    const sent = await getSes().send(new SendRawEmailCommand({ RawMessage: { Data: built.message } }));
    return { mode: "ses-raw", to, messageId: sent.MessageId };
  }
  const plain = await getSes().send(
    new SendEmailCommand({
      Source: fromAddress(),
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: {
          ...(text ? { Text: { Data: text } } : {}),
          ...(html ? { Html: { Data: html } } : {}),
        },
      },
    }),
  );
  return { mode: "ses", to, messageId: plain.MessageId };
}

/**
 * The single email a customer gets when their payment succeeds: the order
 * confirmation with the tax invoice attached. The content and design live in
 * lib/emailTemplates.js; this function only picks the recipient and attaches
 * the invoice.
 *
 * One email, not two. A captured payment is announced twice (browser redirect +
 * Cashfree webhook); onPaymentCaptured claims the send atomically so exactly one
 * of them delivers.
 *
 * `invoice` may be null: the customer must still be told they paid even if
 * invoice issue failed for some reason.
 */
async function sendOrderConfirmation({ to, order, invoice, invoicePdf }) {
  const { subject, html, text } = templates.orderConfirmation({ order, invoice });
  return send({
    to,
    subject,
    text,
    html,
    attachments:
      invoicePdf && invoice
        ? [
            {
              // Slashes in the invoice number would look like a path in a filename.
              filename: `invoice-${invoice.invoiceNumber.replace(/\//g, "-")}.pdf`,
              content: invoicePdf,
              contentType: "application/pdf",
            },
          ]
        : [],
  });
}

module.exports = { send, sendOrderConfirmation, mode, CAPTURE_DIR };
