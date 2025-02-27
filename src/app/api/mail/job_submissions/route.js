export const dynamic = "force-dynamic";
import sendMail from "../../../../lib/mailer";
import { NextResponse } from "next/server";
import handlebars from "handlebars";
import jobSubmissionTemp from "../../../../lib/emails/jobsubmission";

const compileJobSubmissionTemplate = (toName, jobTitle, jobLink) => {
    const template = handlebars.compile(jobSubmissionTemp);
    return template({ toName, jobTitle, jobLink });
  };


export async function POST(req) {
    try {
      const { to, subject, name, jobTitle, jobLink } = await req.json();
      const emailBody = compileJobSubmissionTemplate( name, jobTitle, jobLink );
  
      await sendMail({ to, subject, body: emailBody });
        
      return NextResponse.json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({ message: "Error sending email" }, { status: 500 });
    }
  }
