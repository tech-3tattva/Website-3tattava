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
 * The single email a customer gets when their payment succeeds: confirmation of
 * the order with the tax invoice attached.
 *
 * One email, not two. Previously a captured payment produced a plain-text
 * confirmation from the browser callback and a separate HTML one from the
 * webhook, because each path had its own template and only one checked whether
 * the other had already run.
 *
 * `invoice` may be null: the customer must still be told their payment
 * succeeded even if invoice issue failed for some reason.
 */
async function sendOrderConfirmation({ to, order, invoice, invoiceHtml }) {
  const rupees = (n) =>
    `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const lines = (order.items || [])
    .map((i) => `  ${i.name} x${i.quantity}  ${rupees(i.subtotal ?? i.price * i.quantity)}`)
    .join("\n");

  const rows = (order.items || [])
    .map(
      (i) => `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #f0ece4">${i.name}</td>
        <td style="padding:6px 0;border-bottom:1px solid #f0ece4;text-align:center">${i.quantity}</td>
        <td style="padding:6px 0;border-bottom:1px solid #f0ece4;text-align:right">${rupees(i.subtotal ?? i.price * i.quantity)}</td>
      </tr>`,
    )
    .join("");

  const subject = `Order ${order.orderNumber} confirmed${invoice ? ` — invoice ${invoice.invoiceNumber}` : ""}`;

  const text = [
    `Thank you for your order.`,
    ``,
    `Order  : ${order.orderNumber}`,
    invoice ? `Invoice: ${invoice.invoiceNumber}` : null,
    `Paid   : ${rupees(order.total)}`,
    ``,
    lines,
    ``,
    invoice ? `Your tax invoice is attached. Prices include GST; the tax portion is shown separately.` : null,
    `You will receive tracking details once your parcel is booked.`,
    ``,
    `3TATTAVA — SankalpaSiddhi Ayupharma Pvt. Ltd.`,
    `GSTIN 07ABSCS9652C1ZU · support@3tattava.com · +91 95601 49956`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#1b1b1b;max-width:560px">
      <h2 style="color:#1c1304;font-size:19px;margin:0 0 4px">Order confirmed</h2>
      <p style="font-size:14px;color:#555;margin:0 0 16px">
        Thank you for your order from <strong>3TATTAVA Performance Ayurveda</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:13.5px">
        <thead>
          <tr>
            <th style="text-align:left;padding:0 0 6px;color:#888;font-size:11px;letter-spacing:.08em">ITEM</th>
            <th style="text-align:center;padding:0 0 6px;color:#888;font-size:11px">QTY</th>
            <th style="text-align:right;padding:0 0 6px;color:#888;font-size:11px">AMOUNT</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="font-size:15px;margin:14px 0"><strong>Paid: ${rupees(order.total)}</strong></p>
      <table style="font-size:13px;color:#555">
        <tr><td style="padding:2px 12px 2px 0">Order</td><td>${order.orderNumber}</td></tr>
        ${invoice ? `<tr><td style="padding:2px 12px 2px 0">Invoice</td><td><strong>${invoice.invoiceNumber}</strong></td></tr>` : ""}
      </table>
      ${invoice ? `<p style="font-size:13px;color:#555;margin-top:14px">Your tax invoice is attached. Prices include GST; the tax portion is shown separately on the invoice.</p>` : ""}
      <p style="font-size:13px;color:#555">You will receive tracking details once your parcel is booked.</p>
      <p style="font-size:11.5px;color:#999;border-top:1px solid #eee;padding-top:10px;margin-top:18px">
        3TATTAVA &middot; SankalpaSiddhi Ayupharma Pvt. Ltd. &middot; GSTIN 07ABSCS9652C1ZU<br>
        support@3tattava.com &middot; +91 95601 49956
      </p>
    </div>`;

  return send({
    to,
    subject,
    text,
    html,
    attachments: invoiceHtml
      ? [
          {
            filename: `invoice-${invoice.invoiceNumber.replace(/\//g, "-")}.html`,
            content: invoiceHtml,
            contentType: "text/html; charset=utf-8",
          },
        ]
      : [],
  });
}

module.exports = { send, sendOrderConfirmation, mode, CAPTURE_DIR };
