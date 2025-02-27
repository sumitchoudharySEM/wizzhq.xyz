export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

// GET request to fetch proof of work data for a particular powId for the edit modal
export async function GET(request: Request) {
  let connection;

  try {
    const url = new URL(request.url);
    const powId = url.searchParams.get("powId");

    console.log("Request received to fetch POW data for powId:", powId); 

    if (!powId) {
      console.error("No powId found in the request");
      return NextResponse.json({ error: "No powId found" }, { status: 400 });
    }

    connection = await createConnection();

    const [pow] = await connection.query(
      "SELECT * FROM pow WHERE id = ?",
      [powId]
    );

    console.log("Fetched POW data:", pow);

    // Check if pow exists
    if (!pow || pow.length === 0) {
      console.error("POW not found for the provided id:01", powId);
      return NextResponse.json({ error: "Pow not found" }, { status: 404 });
    }

    return NextResponse.json({ pow: pow[0] }); 
  } catch (error) {
    console.error("Error retrieving proof of work entry:02", error); 
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } 
}

// PUT request to update the proof of work data for a particular powId for the edit modal "project_title, project_description, skills_used, link"
export async function PUT(request: Request) {
  let connection;

  try {
    const url = new URL(request.url);
    const powId = url.searchParams.get("powId");
    const body = await request.json();
    const session = await auth();
    const userId = session?.user?.id;

    // Ensure user exists
    if (userId == null || userId == undefined) {
      return NextResponse.json({ error: "No user id found" }, { status: 400 });
    }

    // Ensure `powId` exists
    if (!powId) {
      return NextResponse.json({ error: "No powId found" }, { status: 400 });
    }

    // Define allowed fields for updating
    const allowedFields = [
      "project_title",
      "project_description",
      "skills_used",
      "link",
    ];

    // Filter and prepare update fields
    const updateFields: { [key: string]: any } = {};
    allowedFields.forEach((field) => {
      if (body[field] !== undefined && body[field] !== null) {
        updateFields[field] = body[field];
      }
    });

    // Ensure there are fields to update
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    // Create database connection
    connection = await createConnection();

    // Prepare SQL query
    const setClause = Object.keys(updateFields)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = [...Object.values(updateFields), powId];

    const query = `UPDATE pow SET ${setClause} WHERE id = ?`;

    const [result] = await connection.execute(query, values);

    // Check if the row was successfully updated
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: "No proof of work found with the given powId" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Proof of work updated successfully",
      updatedFields: updateFields,
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

