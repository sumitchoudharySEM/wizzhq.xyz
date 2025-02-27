import nodemailer from "nodemailer";

export async function sendMail({ to, subject, name, body }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
  try {
    const testResult = await transport.verify();
    console.log("Connected to SMTP server:", testResult);
  } catch (error) {
    console.error("Error connecting to SMTP server:", error);
    return;
  }

  try {
    const info = await transport.sendMail({
      from: `"Wizz" <${SMTP_EMAIL}>`,
      to: to, // Leave empty for Bcc usage
      //   bcc: to, // Use Bcc to send to multiple recipients without revealing addresses
      subject,
      html: body,
    });
    console.log("Message sent", info);
  } catch (error) {
    console.error("Error sending email", error);
  }
}

export default sendMail;
