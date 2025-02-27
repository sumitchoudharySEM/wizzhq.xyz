export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function GET(request: Request) {
  let connection;

  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    connection = await createConnection();

    const [listing] = await connection.query(
      "SELECT * FROM listings WHERE slug = ?",
      [slug]
    );

    if (listing.length === 0) {
      return NextResponse.json({ listing: null });
    }

    // return all listings
    return NextResponse.json({ listing: listing[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let connection;

  try {
    // 1. Validate user authentication
    const session = await auth();
    const userid = session?.user?.id;

    if (!userid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();

    // 3. Define required fields and their validation rules
    const requiredFields = [
      "template",
      "title",
      "end_date",
      "skills",
      "contact",
      "categories",
      "short_description",
      "requirements",
      "deliverables",
      "reward",
      "wallet_inst",
      "submission_type",
    ];

    // 4. Check for required fields
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          fields: missingFields,
        },
        { status: 400 }
      );
    }

    // 5. Validate specific fields
    // Title length validation
    if (body.title.length < 10 || body.title.length > 100) {
      return NextResponse.json(
        {
          error: "Title must be between 10 and 100 characters",
        },
        { status: 400 }
      );
    }

    // End date validation
    const endDate = new Date(body.end_date);
    const currentDate = new Date();
    const minDate = new Date(currentDate.getTime() + 47 * 60 * 60 * 1000); // 48 hours from now
    const maxDate = new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    if (endDate < minDate) {
      return NextResponse.json(
        { error: "End date must be at least 48 hours from now" },
        { status: 400 }
      );
    }

    if (endDate > maxDate) {
      return NextResponse.json(
        { error: "End date cannot be more than 1 year from now" },
        { status: 400 }
      );
    }

    // Short description validation
    if (
      body.short_description.length < 40 ||
      body.short_description.length > 400
    ) {
      return NextResponse.json(
        {
          error: "Short description must be between 40 and 400 characters",
        },
        { status: 400 }
      );
    }

    // Reward validation
    try {
      const rewardData = JSON.parse(body.reward);
      if (
        !rewardData.token ||
        !rewardData.prizes ||
        rewardData.prizes.length === 0
      ) {
        return NextResponse.json(
          {
            error: "Invalid reward structure",
          },
          { status: 400 }
        );
      }

      // Validate first prize is greater than 0
      if (!rewardData.prizes[0] || rewardData.prizes[0] <= 0) {
        return NextResponse.json(
          {
            error: "First prize amount must be greater than 0",
          },
          { status: 400 }
        );
      }
    } catch (e) {
      return NextResponse.json(
        {
          error: "Invalid reward JSON format",
        },
        { status: 400 }
      );
    }

    // 6. Create database connection
    connection = await createConnection();

    // 7. Check if partner exists
    const [partners] = await connection.query(
      "SELECT * FROM partners WHERE creator_id = ?",
      [userid]
    );

    if (!partners || partners.length === 0) {
      return NextResponse.json(
        {
          error: "No partner found for this user",
        },
        { status: 404 }
      );
    }

    // 8. Prepare data for insertion
    const allowedFields = [
      "template",
      "title",
      "end_date",
      "location",
      "skills",
      "contact",
      "categories",
      "short_description",
      "detailed_description",
      "requirements",
      "deliverables",
      "reward",
      "wallet_inst",
      "submission_type",
    ];

    const updateData: { [key: string]: any } = {};

    allowedFields.forEach((field) => {
      if (body[field] !== undefined && body[field] !== null) {
        updateData[field] = body[field];
      }
    });

    // Add additional required fields
    updateData.creator_id = userid;
    updateData.partner_id = partners[0].id;
    updateData.type = "bounty";
    //create slug from title and partnername
    updateData.slug = body.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .replace(/-+/g, "_")
      .replace(/^-+|-+$/g, "");

    // 9. Prepare and execute query
    const columns = Object.keys(updateData).join(", ");
    const placeholders = Object.keys(updateData)
      .map(() => "?")
      .join(", ");
    const values = Object.values(updateData);

    const query = `
      INSERT INTO listings (${columns})
      VALUES (${placeholders})
    `;

    const [result] = await connection.execute(query, values);

    // 10. Validate insertion result
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: "Failed to create listing" },
        { status: 500 }
      );
    }
    
    // 11. Get creator's and admin emails
    const [creatorUsers] = await connection.query(
      "SELECT email FROM users WHERE id = ?",
    [userid]
    );
    const creatorEmail = creatorUsers[0]?.email;

    // 12. Fetch all admin emails
    const [admins] = await connection.query("SELECT user_email FROM admins");
    // console.log("Admins", admins);
    const adminEmails = admins.map((admin: { user_email: string }) => admin.user_email);

    // 13. Prepare email recipients
    const recipients = new Set([
      "contact@wizzhq.xyz", 
      "socials.wizz@gmail.com", 
      ...adminEmails
    ]);

    // 14. Add partner and creator emails
    if (partners[0].email !== creatorEmail) {
      // If emails different then send both
      recipients.add(partners[0].email);
      recipients.add(creatorEmail);
    } else {
      // If emails same send only one
      recipients.add(partners[0].email);
    }

    // 13. Prepare email data
    const emailData = {
      partnerEmail: partners[0].email, 
      partnerName: partners[0].name,   
      bountyTitle: body.title,
      bountyLink: `${process.env.NEXTAUTH_URL}/dashboard/bounties/${updateData.slug}`,
      recipients: Array.from(recipients),
    };

    // console.log("Email Data", emailData);
    
    // 15. call email api to send mails 
    const response = await fetch("https://wizzhq.xyz/api/mail/new_bounty_created", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);
    } else {
      const errorResult = await response.json();
      console.error(errorResult.message || "Failed to send email");
    }

    // 16. Prepare redirect URL 
    const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard/bounties/${updateData.slug}` || ''

    // 17. Return success response
    return NextResponse.json({
      message: "Listing created successfully",
      data: updateData,
      id: (result as any).insertId,
      redirectUrl: dashboardUrl,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error" + error,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
