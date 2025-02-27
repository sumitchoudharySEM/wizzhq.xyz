export const dynamic = "force-dynamic";
import sendMail from "../../../../lib/mailer";
import { NextResponse } from "next/server";
import handlebars from "handlebars";
import winnersTemp from "../../../../lib/emails/winners";

const compileWinnersTemplate = (toName, bountyTitle, bountyLink, reward, position) => {
  const template = handlebars.compile(winnersTemp);
  return template({ toName, bountyTitle, bountyLink, reward, position });
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { winners, bountyDetails } = body;

    // 1. validate req body
    if (!winners || !Array.isArray(winners) || !bountyDetails) {
      return NextResponse.json(
        { error: "Invalid request body - winners and bountyDetails are required" },
        { status: 400 }
      );
    }

    const emailResults = [];

    // 2. process each winner
    for (const winner of winners) {
      try {
        const { email, name, reward, position } = winner;
        const { bountyTitle, bountyLink } = bountyDetails;

        // a.validate req fields
        if (!email || !name || !reward || !bountyTitle || !bountyLink) {
          throw new Error(`Missing required fields for winner: ${name}`);
        }

        // b.compile email template
        const emailBody = compileWinnersTemplate(
          name,
          bountyTitle,
          bountyLink,
          reward,
          position || 'Bonus Prize'
        );

        // c.send email
        await sendMail({
          to: email,
          subject: `🎉 Congratulations! You've won the bounty: ${bountyTitle}`,
          body: emailBody
        });

        emailResults.push({
          email,
          status: 'success'
        });

      } catch (winnerError) {
        console.error(`Error sending email to winner:`, winnerError);
        emailResults.push({
          email: winner.email,
          status: 'failed',
          error: winnerError.message
        });
      }
    }

    // 3.check if any mails are sent successfully
    const successfulEmails = emailResults.filter(result => result.status === 'success');
    if (successfulEmails.length === 0) {
      return NextResponse.json(
        { error: "Failed to send any notification emails", results: emailResults },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `winner notification emails sent successfully`,
      results: emailResults
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error sending winner notifications", details: error.message },
      { status: 500 }
    );
  }
}