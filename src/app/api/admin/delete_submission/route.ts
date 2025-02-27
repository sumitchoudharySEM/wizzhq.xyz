import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
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

    // 4. Parse the request body for listing_id and submission_id
    const { submission_id } = await request.json();

    if (!submission_id) {
      return NextResponse.json(
        { error: "Submission ID are required" },
        { status: 400 }
      );
    }

    // 5. Delete the submission based on listing_id and submission_id
    const [result] = await connection.execute(
      'DELETE FROM bounty_submissions WHERE id = ?',
      [submission_id]
    );

    // 6. Check if any rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "No submission found for this submission ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Submission deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } 
}
