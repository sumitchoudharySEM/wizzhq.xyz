export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

export async function GET(request: Request) {
  let connection;
  const url = new URL(request.url);
  const job_id = url.searchParams.get("job");

  try {
    if (job_id == null || job_id == undefined) {
      return NextResponse.json({ error: "No job found" }, { status: 400 });
    }

    connection = await createConnection();

    const [submissionsJob] = await connection.query(
      "SELECT * FROM job_submissions WHERE job_id = ?",
      [job_id]
    );

    if (!submissionsJob || submissionsJob.length === 0) {
      return NextResponse.json({ submissions: [] });
    }

    return NextResponse.json({ submissions: submissionsJob }); 
  } catch (error) {
    console.error("Error retrieving Job submission", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let connection;

  try {
    const body = await request.json();
    const session = await auth();
    const userId = session?.user?.id;
    const url = new URL(request.url);
    const jobId = url.searchParams.get("job");

    if (userId == null || userId == undefined) {
      return NextResponse.json({ error: "No user id found" }, { status: 400 });
    }

    // if (!body.wallet_address || !body.wallet_address.trim()) {
    //   return NextResponse.json(
    //     { error: "Wallet address is required" },
    //     { status: 400 }
    //   );
    // }

    const processedBody = {
      ...body,
    default_answers: JSON.stringify(body.default_answers),
    questionnaire_answers: JSON.stringify(body.questionnaire_answers)
    };

    const allowedFields = [
        "email",
        "x_username",
        "telegram_username",
        "additional_info",
        "default_answers",
        "questionnaire_answers",
    ];
    const proofData: { [key: string]: any } = {};

    allowedFields.forEach((field) => {
      if (processedBody[field] !== undefined && processedBody[field] !== null) {
        proofData[field] = processedBody[field];
      }
    });

    proofData.user_id = userId;
    proofData.job_id = jobId;

    connection = await createConnection();

    const [job] = await connection.query(
      "SELECT * FROM jobs WHERE id = ?",
      [jobId]
    );

    if (job.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job[0].end_date < new Date()) {
      return NextResponse.json(
        { error: "Job is no longer active" },
        { status: 400 }
      );
    }

    const [existingSubmission] = await connection.query(
      "SELECT * FROM job_submissions WHERE user_id = ? AND job_id = ?",
      [userId, jobId]
    );

    if (existingSubmission.length > 0) {
      const setClause = Object.keys(proofData)
        .map(key => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(proofData), userId, jobId];

      const query = `
        UPDATE job_submissions 
        SET ${setClause}
        WHERE user_id = ? AND job_id = ?
      `;

      const [updateResult] = await connection.execute(query, values);

      if ((updateResult as any).affectedRows === 0) {
        return NextResponse.json(
          { error: "No updates were made" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Submission updated successfully",
        updated: {
          ...proofData,
          default_answers: body.default_answers,
          questionnaire_answers: body.questionnaire_answers
        }
      });
    } else {
      const columns = Object.keys(proofData).join(", ");
      const placeholders = Object.keys(proofData)
        .map(() => "?")
        .join(", ");
      const values = Object.values(proofData);

      const query = `INSERT INTO job_submissions (${columns}) VALUES (${placeholders})`;

      const [result] = await connection.execute(query, values);

      if ((result as any).affectedRows === 0) {
        return NextResponse.json(
          { error: "Failed to add submission" },
          { status: 404 }
        );
      }

      try {
        const [user] = await connection.query(
          "SELECT * FROM users WHERE id = ?",
          [userId]
        );

        if (user.length === 0) {
          return NextResponse.json({ user: null });
        }
        const usermail = user[0].email;
        const userName = user[0].name;

        const responsemail = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mail/job_submissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: usermail,
            subject: "Application Recorded Successfully",
            name: userName,
            jobTitle: job[0].title,
            jobLink: `https://wizzhq.xyz/hirings/${job[0].slug}`,
          }),
        });

        if (responsemail.ok) {
          const result = await responsemail.json();
          console.log(result.message);
        } else {
          const errorResult = await responsemail.json();
          console.error(errorResult.message || "Failed to send email");
        }
      } catch (error) {
        console.error("Error sending email", error);
      }

      return NextResponse.json({
        message: "Submission added successfully",
        proofData: {
          ...proofData,
          default_answers: body.default_answers,
          questionnaire_answers: body.questionnaire_answers
        }
      });
    }
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}