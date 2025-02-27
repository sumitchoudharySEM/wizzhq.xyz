import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  let connection;
  try {
    // 1. Get user email from session using auth()
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    connection = await createConnection();

    // 2. Check if the user is an admin
    const [adminRows] = await connection.execute(
      'SELECT * FROM admins WHERE user_email = ?',
      [session.user.email]
    );

    // 3. If the user is not an admin, return an error
    if (!Array.isArray(adminRows) || adminRows.length === 0) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }
    
    //4. Get submission_id from query params passed from the frontend
    const url = new URL(request.url);
    const submissionId = url.searchParams.get("submission_id");

    if (!submissionId) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    // 5. Fetch submission details by submission_id
    const [submissionRows] = await connection.execute(
      'SELECT * FROM bounty_submissions WHERE id = ?',
      [submissionId]
    );

    // 6. If submission is found, log it and return
    if (Array.isArray(submissionRows) && submissionRows.length > 0) {
      console.log("Submission details:", submissionRows[0]);
      return NextResponse.json(
        { submission: submissionRows[0] },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } 
}

export async function PUT(request: Request) {
    let connection;
  
    try {
      // 1. Get user email from session using auth()
      const session = await auth();
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      connection = await createConnection();
  
      // 2. Check if the user is an admin
      const [adminRows] = await connection.execute(
        'SELECT * FROM admins WHERE user_email = ?',
        [session.user.email]
      );
  
      // 3. If the user is not an admin, return an error
      if (!Array.isArray(adminRows) || adminRows.length === 0) {
        return NextResponse.json(
          { error: "Unauthorized - Admin access required" },
          { status: 403 }
        );
      }
  
      // 4. Parse the request body
      const body = await request.json();
  
      // 5. Validate the required fields in the body
      if (!body.submission_links || !Array.isArray(body.submission_links) || body.submission_links.length === 0) {
        return NextResponse.json(
          { error: "At least one submission link is required" },
          { status: 400 }
        );
      }
  
      if (!body.wallet_address || !body.wallet_address.trim()) {
        return NextResponse.json(
          { error: "Wallet address is required" },
          { status: 400 }
        );
      }
  
      const processedBody = {
        ...body,
        submission_links: JSON.stringify(body.submission_links),
        last_edit_on: new Date().toISOString()
      };
  
      const allowedFields = [
        "tweet_link",
        "submission_links",
        "additional_info",
        "wallet_address",
        "last_edit_on",
      ];
  
      const proofData: { [key: string]: any } = {};
  
      allowedFields.forEach((field) => {
        if (processedBody[field] !== undefined && processedBody[field] !== null) {
          proofData[field] = processedBody[field];
        }
      });
  
      // 6. Get submission_id from query params or request body
      const url = new URL(request.url);
      const submission_id = url.searchParams.get("submission_id");
  
      if (!submission_id) {
        return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
      }
  
      // 7. Retrieve the existing submission
      const [existingSubmission] = await connection.query(
        "SELECT * FROM bounty_submissions WHERE id = ?",
        [submission_id]
      );
  
      if (existingSubmission.length === 0) {
        return NextResponse.json({ error: "Submission not found" }, { status: 404 });
      }
  
      // 8. Apply the updates to the submission
      const setClause = Object.keys(proofData)
        .map(key => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(proofData), submission_id];
  
      const query = `
        UPDATE bounty_submissions 
        SET ${setClause}
        WHERE id = ?
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
        updated: { ...proofData, submission_links: body.submission_links }
      });
  
    } catch (error) {
      console.error("Error fetching submission:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
}
  
