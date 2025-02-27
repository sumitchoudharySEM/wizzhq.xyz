export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function GET(request: Request) {
  let connection;

  try {
    const url = new URL(request.url);
    const username = url.searchParams.get("user");

    // Ensure user ID is available
    if (username == null || username == undefined) {
      return NextResponse.json({ error: "No username found" }, { status: 400 });
    }

    // Establish database connection
    connection = await createConnection();

    // Query all proof of work entries for the authenticated user

    // get user from username
    const [user] = await connection.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    // Check if user exists
    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user[0].id;

    const [powEntries] = await connection.query(
      "SELECT * FROM pow WHERE user_id = ?",
      [userId]
    );

    // Check if any entries are found
    if (!powEntries || powEntries.length === 0) {
      return NextResponse.json({ message: "No proof of work entries found" });
    }

    return NextResponse.json({ pow: powEntries }); // Return the list of POW entries
  } catch (error) {
    console.error("Error retrieving proof of work entries:", error);
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

    // Ensure user exists
    if (userId == null || userId == undefined) {
      return NextResponse.json({ error: "No user id found" }, { status: 400 });
    }

    // Define the fields allowed for proof of work
    const allowedFields = [
      "project_title",
      "project_description",
      "skills_used",
      "link",
    ];
    const proofData: { [key: string]: any } = {};

    // Filter and add only allowed fields to proofData
    allowedFields.forEach((field) => {
      if (body[field] !== undefined && body[field] !== null) {
        proofData[field] = body[field];
      }
    });

    // Add user_id to proofData
    proofData.user_id = userId;

    // Check if any fields are provided
    if (Object.keys(proofData).length === 1) {
      // Only `user_id` would mean no proof fields
      return NextResponse.json(
        { error: "No valid fields to add proof of work" },
        { status: 400 }
      );
    }

    // Create database connection
    connection = await createConnection();

    // Prepare SQL query with placeholders
    const columns = Object.keys(proofData).join(", ");
    const placeholders = Object.keys(proofData)
      .map(() => "?")
      .join(", ");
    const values = Object.values(proofData);

    const query = `INSERT INTO pow (${columns}) VALUES (${placeholders})`;

    const [result] = await connection.execute(query, values);

    // Check if the row was successfully inserted
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: "Failed to add proof of work" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Proof of work added successfully",
      proofData,
    });
  } catch (error) {
    console.error("Detailed error:", error); // Detailed error logging
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } 
}
