export const dynamic = "force-dynamic";
import sendMail from "../../../../lib/mailer";
import { NextResponse } from "next/server";
import handlebars from "handlebars";
import jobCreationTemp from "../../../../lib/emails/newjobcreated";

// Compiling the email template
const compileJobCreationTemplate = (toName, jobTitle, jobLink) => {
  const template = handlebars.compile(jobCreationTemp);
  return template({ toName, jobTitle, jobLink });
};

export async function POST(request) {
  try {
    // 1. Parse the request body
    const { partnerEmail, partnerName, jobTitle, jobLink, recipients } =
      await request.json();

    // console.log("Request body:", { partnerEmail, partnerName, bountyTitle, bountyLink, recipients });

    // 2. Prepare the email subject and body
    const emailSubject = `New Job Created: ${jobTitle}`;
    const emailBody = compileJobCreationTemplate(partnerName,jobTitle,jobLink);

    // 3. Send email to the list of recipients
    const sendEmailPromises = recipients.map((recipientEmail) =>
      sendMail({
        to: recipientEmail,
        subject: emailSubject,
        body: emailBody,
      })
    );

    // 4. Await all emails to be sent
    await Promise.all(sendEmailPromises);

    // 5. Return success response
    return NextResponse.json({
      message: "Job created and emails sent successfully!",
    });
  } catch (error) {
    console.error("Email API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to send emails",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
