import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

function createTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
}

export async function sendEmail(payload: EmailPayload) {
  const transport = createTransport();
  if (!transport) {
    console.info("[email:skip]", payload.subject, payload.to);
    return { skipped: true };
  }

  return transport.sendMail({
    from: process.env.SMTP_FROM ?? "Ahiyade <notifications@ahiyade.bj>",
    ...payload
  });
}
