export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    let connection;
    const url = new URL(request.url);
    const listing_id = url.searchParams.get("listing");
  
    try {
      if (!listing_id) {
        return NextResponse.json({ error: "No listing found" }, { status: 400 });
      }
  
      connection = await createConnection();
  
      // Removed ORDER BY clause
      const [submissionsWithUsers] = await connection.query(`
        SELECT 
          s.*,
          u.id as user_id,
          u.name as user_name,
          u.username as user_username,
          u.image as user_image
        FROM bounty_submissions s
        LEFT JOIN users u ON s.user_id = u.id
        WHERE s.listing_id = ?
      `, [listing_id]);
  
      if (!submissionsWithUsers || submissionsWithUsers.length === 0) {
        return NextResponse.json({ message: "No submissions found" });
      }
  
      return NextResponse.json({ submissions: submissionsWithUsers });
    } catch (error) {
      console.error("Error retrieving submissions:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }