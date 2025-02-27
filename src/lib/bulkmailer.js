// mailer.js
import nodemailer from "nodemailer";

const BATCH_SIZE = 50; // Adjust based on your SMTP server limits

export async function sendMail({ to, subject, name, body, isBulk = false }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
    pool: true, // Use pooled connections for better performance
    maxConnections: 5,
    maxMessages: 100,
  });

  try {
    const testResult = await transport.verify();
    console.log("Connected to SMTP server:", testResult);
  } catch (error) {
    console.error("Error connecting to SMTP server:", error);
    throw error;
  }

  if (isBulk && Array.isArray(to)) {
    // Split recipients into batches
    const batches = [];
    for (let i = 0; i < to.length; i += BATCH_SIZE) {
      batches.push(to.slice(i, i + BATCH_SIZE));
    }

    const results = [];
    for (const batch of batches) {
      try {
        const info = await transport.sendMail({
          from: `"Wizz" <${SMTP_EMAIL}>`,
          bcc: batch.join(','), // Use BCC for privacy
          subject,
          html: body,
        });
        results.push({ success: true, info });
      } catch (error) {
        console.error("Error sending batch:", error);
        results.push({ success: false, error });
      }
    }
    return results;
  } else {
    // Single email sending
    try {
      const info = await transport.sendMail({
        from: `"Wizz" <${SMTP_EMAIL}>`,
        to,
        subject,
        html: body,
      });
      return { success: true, info };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }
  }
}

export default sendMail;