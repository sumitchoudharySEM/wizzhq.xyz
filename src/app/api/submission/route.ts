export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function GET(request: Request) {
  let connection;
  const url = new URL(request.url);
  const listing_id = url.searchParams.get("listing");

  try {
    if (listing_id == null || listing_id == undefined) {
      return NextResponse.json({ error: "No listing found" }, { status: 400 });
    }

    connection = await createConnection();

    const [submissionsListing] = await connection.query(
      "SELECT * FROM bounty_submissions WHERE listing_id = ?",
      [listing_id]
    );

    if (!submissionsListing || submissionsListing.length === 0) {
      return NextResponse.json({ submissions: [] });
    }

    return NextResponse.json({ submissions: submissionsListing }); 
  } catch (error) {
    console.error("Error retrieving listing submission", error);
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
    const listing_id = url.searchParams.get("listing");

    if (userId == null || userId == undefined) {
      return NextResponse.json({ error: "No user id found" }, { status: 400 });
    }

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

    // Convert submission_links array to JSON string
    const processedBody = {
      ...body,
      submission_links: JSON.stringify(body.submission_links)
    };

    const allowedFields = [
      "tweet_link",
      "submission_links",
      "additional_info",
      "wallet_address",
    ];
    const proofData: { [key: string]: any } = {};

    allowedFields.forEach((field) => {
      if (processedBody[field] !== undefined && processedBody[field] !== null) {
        proofData[field] = processedBody[field];
      }
    });

    proofData.user_id = userId;
    proofData.listing_id = listing_id;

    connection = await createConnection();

    const [listing] = await connection.query(
      "SELECT * FROM listings WHERE id = ?",
      [listing_id]
    );

    if (listing.length === 0) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing[0].end_date < new Date()) {
      return NextResponse.json(
        { error: "Listing is no longer active" },
        { status: 400 }
      );
    }

    const [existingSubmission] = await connection.query(
      "SELECT * FROM bounty_submissions WHERE user_id = ? AND listing_id = ?",
      [userId, listing_id]
    );

    if (existingSubmission.length > 0) {
      const setClause = Object.keys(proofData)
        .map(key => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(proofData), userId, listing_id];

      const query = `
        UPDATE bounty_submissions 
        SET ${setClause}
        WHERE user_id = ? AND listing_id = ?
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
          submission_links: body.submission_links // Return the array format to client
        }
      });
    } else {
      const columns = Object.keys(proofData).join(", ");
      const placeholders = Object.keys(proofData)
        .map(() => "?")
        .join(", ");
      const values = Object.values(proofData);

      const query = `INSERT INTO bounty_submissions (${columns}) VALUES (${placeholders})`;

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

        const responsemail = await fetch("https://wizzhq.xyz/api/send-mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: usermail,
            subject: "Submission Recorded Successfully",
            name: userName,
            bountyTitle: listing[0].title,
            bountyLink: `https://wizzhq.xyz/bounties/${listing[0].slug}`,
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
          submission_links: body.submission_links // Return the array format to client
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