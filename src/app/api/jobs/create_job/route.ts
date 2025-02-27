export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

export async function GET(request: Request) {
  let connection;

  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    connection = await createConnection();

    const [job] = await connection.query(
      "SELECT * FROM jobs WHERE slug = ?",
      [slug]
    );

    if (job.length === 0) {
      return NextResponse.json({ job: null });
    }

    // return all job details
    return NextResponse.json({ job: job[0] });
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
      "title",
      "end_date",
      "skills",
      "contact",
      "categories",
      "short_description",
      "requirements",
      "position",
      "job_type",
      "payment_type",
      "roles_responsibility"
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

    // Payment validation based on payment_type
    if (body.payment_type === 'fixed') {
      if (!body.fixed_amount || body.fixed_amount <= 0) {
        return NextResponse.json(
          {
            error: "Fixed amount must be greater than 0",
          },
          { status: 400 }
        );
      }
    } else if (body.payment_type === 'range') {
      if (!body.min_amount || !body.max_amount || body.min_amount <= 0 || body.max_amount <= body.min_amount) {
        return NextResponse.json(
          {
            error: "Invalid payment range. Maximum amount must be greater than minimum amount, and minimum amount must be greater than 0",
          },
          { status: 400 }
        );
      }
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
      "reward",
      "title",
      "end_date",
      "location",
      "skills",
      "contact",
      "categories",
      "short_description",
      "detailed_description",
      "requirements",
      "job_perks",
      "roles_responsibility",
      "position",
      "job_type",
      "payment_type",
      "min_amount",
      "max_amount",
      "fixed_amount",
      "payment_period",
      "duration",
      "questionnaire",
    ];

    const updateData: { [key: string]: any } = {};

    allowedFields.forEach((field) => {
      if (body[field] !== undefined && body[field] !== null) {
        // stringify questionnaire obj for db storage
        if (field === 'questionnaire') {
          updateData[field] = JSON.stringify(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    });

    // Add additional required fields
    updateData.creator_id = userid;
    updateData.partner_id = partners[0].id;
    updateData.created_on = new Date().toISOString().split('T')[0];
    updateData.type = "job";
    updateData.verified = 0;
    
    // Create slug from title
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
      INSERT INTO jobs (${columns})
      VALUES (${placeholders})
    `;

    const [result] = await connection.execute(query, values);

    // 10. Validate insertion result
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: "Failed to create job listing" },
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
    const adminEmails = admins.map((admin: { user_email: string }) => admin.user_email);

    // 13. Prepare email recipients
    const recipients = new Set([
      "contact@wizzhq.xyz",
      "socials.wizz@gmail.com",
      ...adminEmails
    ]);

    // 14. Add partner and creator emails
    if (partners[0].email !== creatorEmail) {
      recipients.add(partners[0].email);
      recipients.add(creatorEmail);
    } else {
      recipients.add(partners[0].email);
    }

    // 15. Prepare email data
    const emailData = {
      partnerEmail: partners[0].email,
      partnerName: partners[0].name,
      jobTitle: body.title,
      jobLink: `${process.env.NEXTAUTH_URL}/dashboard/hirings/${updateData.slug}`,
      recipients: Array.from(recipients),
    };

    // 16. Send email notification
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mail/new_job_created`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      console.error(errorResult.message || "Failed to send email");
    }

    // 17. Prepare redirect URL
    const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard/hirings/${updateData.slug}` || '';

    // 18. Return success response
    return NextResponse.json({
      message: "Job listing created successfully",
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