export const dynamic = "force-dynamic";
import sendMail from "../../../../lib/mailer";
import { NextResponse } from "next/server";
import handlebars from "handlebars";
import verifiedBountyTemp from "../../../../lib/emails/verifiedbounty";

const compileVerifiedBountyTemplate = (toName, bountyTitle, bountyLink) => {
    const template = handlebars.compile(verifiedBountyTemp);
    return template({ toName, bountyTitle, bountyLink });
  };


export async function POST(req) {
    try {
      const { to, subject, name, bountyTitle, bountyLink } = await req.json();
      const emailBody = compileVerifiedBountyTemplate( name, bountyTitle, bountyLink );
  
      await sendMail({ to, subject, body: emailBody });
        
      return NextResponse.json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({ message: "Error sending email" }, { status: 500 });
    }
  }
