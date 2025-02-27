export const dynamic = "force-dynamic";
import sendMail from "../../../../lib/bulkmailer";
import { NextResponse } from "next/server";
import handlebars from "handlebars";
import newbountyTemp from "../../../../lib/emails/newbounty";
import { createConnection } from "@/lib/db";

const compilenewbountyTemplate = () => {
  const template = handlebars.compile(newbountyTemp);
  return template();
};

export async function POST(req) {
  let connection;
  const BATCH_SIZE = 50;
  try {
    connection = await createConnection();
    const emailBody = compilenewbountyTemplate();

    // Fetch all users
    const [users] = await connection.query(`SELECT * FROM users`);
    const emails = users.map((user) => user.email);

    // Send bulk email
    const result = await sendMail({
      to: emails,
      subject: "New Bounty Alert!",
      body: emailBody,
      isBulk: true
    });

    // Process results
    const successCount = result.filter(r => r.success).length * BATCH_SIZE;
    const failedCount = result.filter(r => !r.success).length * BATCH_SIZE;

    return NextResponse.json({
      message: "Bulk email processed",
      totalAttempted: emails.length,
      approximateSuccessCount: successCount,
      approximateFailedCount: failedCount,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error sending emails" },
      { status: 500 }
    );
  } 
}

