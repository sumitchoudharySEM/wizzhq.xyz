export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function GET(request: Request) {
    let connection;

    try {
        const url = new URL(request.url);
        const slug = url.searchParams.get("slug");

        console.log("Request received to fetch bounty data for slug", slug);

        if (!slug) {
            console.error("No slug found in request:01", slug);
            return NextResponse.json({ error: "No slug found" }, { status: 400 });
        }

        connection = await createConnection();

        const [listing] = await connection.query(
            "SELECT * FROM listings WHERE slug = ?",
            [slug]
        );

        console.log("Fetched listing data:", listing);

        if (listing.length === 0) {
            return NextResponse.json({ listing: null });
        }

        // return all listings
        return NextResponse.json({ listing: listing[0] });
    } catch (error) {
        console.error("Error retrieving proof of work entry:02", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function PUT(request: Request) {
    let connection;
  
    try {
      const url = new URL(request.url);
      const slug = url.searchParams.get("slug");
      const session = await auth();
      const userId = session?.user?.id;
      const userEmail = session?.user?.email;
  
      // 1. Validate user authentication
      if (!userId || !userEmail) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
  
      // 2. Ensure slug exists
      if (!slug) {
        return NextResponse.json(
          { error: "No slug found" }, 
          { status: 400 }
        );
      }

      connection = await createConnection();

      // 3. Check if user is an admin
      const [adminRows] = await connection.execute(
          'SELECT * FROM admins WHERE user_email = ?',
        [userEmail]
      );
      
      const isAdmin = Array.isArray(adminRows) && adminRows.length > 0;

      // 4. Check if the listing exists and belongs to the creator
      const [existingListings] = await connection.query(
        "SELECT * FROM listings WHERE slug = ? AND creator_id = ?",
        [slug, userId]
      );

      if (!existingListings || existingListings.length === 0) {
        return NextResponse.json(
            { error: "Listing not found" },
            { status: 404 }
        );
      }

      const listing = existingListings[0];

      // 5. If not an admin, check verify status
      if (!isAdmin && listing.verified === 1) {
        return NextResponse.json(
          { error: "Bounty is already verified and cannot be edited" },
          { status: 403 }
        );
      }
  
      const body = await request.json();
  
      // 6. Validate required fields
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
  
      // 7. Validate fields
      // a. Title length validation
      if (body.title.length < 10 || body.title.length > 100) {
        return NextResponse.json(
          {
            error: "Title must be between 10 and 100 characters",
          },
          { status: 400 }
        );
      }
  
      // b. End date validation
      const endDate = new Date(body.end_date);
      const currentDate = new Date();
      const minDate = new Date(currentDate.getTime() + 47 * 60 * 60 * 1000);
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
  
      // c. Short description validation
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
  
      // d. Reward validation
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
  
        // e. Validate first prize is greater than 0
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

  
      // // 5. Check if the listing exists and belongs to the user
      // const [existingListings] = await connection.query(
      //   "SELECT * FROM listings WHERE slug = ? AND creator_id = ?",
      //   [slug, userId]
      // );
  
      // if (!existingListings || existingListings.length === 0) {
      //   return NextResponse.json(
      //     {
      //       error: "Listing not found or you don't have permission to edit",
      //     },
      //     { status: 404 }
      //   );
      // }
  
      // 8. Prepare update data
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
  
      // 7. Update slug if title changes
      if (body.title) {
        updateData.slug = body.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "_")
          .replace(/-+/g, "_")
          .replace(/^-+|-+$/g, "");
      }
  
      // 8. Prepare update query
      const setClause = Object.keys(updateData)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(updateData), slug];
  
      const query = `
        UPDATE listings 
        SET ${setClause}
        WHERE slug = ? 
      `;
  
      const [result] = await connection.execute(query, values);
  
      // 9. Validate update result
      if ((result as any).affectedRows === 0) {
        return NextResponse.json(
          { error: "Failed to update listing" },
          { status: 500 }
        );
      }
  
      return NextResponse.json({
        message: "Listing updated successfully",
        data: updateData,
      });

  } catch (error) {
    console.error("Error updating proof of work:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}