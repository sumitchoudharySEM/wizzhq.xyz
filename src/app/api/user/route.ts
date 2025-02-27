export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../auth";

export async function GET(request: Request) {
  let connection;
  try {
    const session = await auth();
    const userid = session?.user?.id;
    connection = await createConnection();
    const [user] = await connection.query("SELECT * FROM users WHERE id = ?", [
      userid,
    ]);

    if (user.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: user[0] });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = body.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    let finalUsername = username;
    let count = 1;

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required fields" },
        { status: 400 }
      );
    }

    const pool = await createConnection();

    // Check for existing user by email first
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [body.email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({ user: existingUsers[0] });
    }

    // Generate unique username
    while (true) {
      const [existingUsername] = await pool.query(
        "SELECT username FROM users WHERE username = ?",
        [finalUsername]
      );

      if (existingUsername.length === 0) break;
      finalUsername = `${username}${count}`;
      count++;
    }

    // Insert new user
    const [result] = await pool.query(
      `INSERT INTO users (name, email, image, username) 
       VALUES (?, ?, ?, ?)`,
      [body.name, body.email, body.image || null, finalUsername]
    );

    const [newUser] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [(result as any).insertId]
    );

    return NextResponse.json({
      message: "User added successfully",
      user: newUser[0]
    });

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

export async function PUT(request: Request) {
  let connection;

  // Validation function similar to frontend
  const validateInput = (value: string, type: string): string | null => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const nameRegex = /^[a-zA-Z0-9\s]+$/;

    if (!value) {
      return `${type} is required`;
    }

    if (value.length < 3) {
      return `${type} must be at least 3 characters long`;
    }

    if (value.length > 15) {
      return `${type} cannot exceed 15 characters`;
    }

    if (type === "Username") {
      if (!usernameRegex.test(value)) {
        return `Username can only contain letters and numbers`;
      }
    } else if (type === "Name") {
      if (!nameRegex.test(value)) {
        return `Name can only contain letters, numbers, and spaces`;
      }
      if (value.trim().length === 0) {
        return `Name cannot be just spaces`;
      }
      if (/\s\s/.test(value)) {
        return `Name cannot contain consecutive spaces`;
      }
      if (value.startsWith(" ") || value.endsWith(" ")) {
        return `Name cannot start or end with spaces`;
      }
    }

    return null;
  };

  try {
    const session = await auth();
    const userid = session?.user?.id;
    const body = await request.json();

    // Required fields validation
    if (!body.name || !body.username) {
      return NextResponse.json(
        { error: "Name and username are required fields" },
        { status: 400 }
      );
    }

    // Validate username
    const usernameError = validateInput(body.username, "Username");
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 });
    }

    // Validate name
    const nameError = validateInput(body.name, "Name");
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    // Extract only the allowed fields from the request body
    const allowedFields = [
      "name",
      "username",
      "skills",
      "location",
      "bio",
      "current_employment",
      "communities",
      "image",
    ];
    const updateData: { [key: string]: any } = {};

    // Filter out undefined values and only include allowed fields
    allowedFields.forEach((field) => {
      if (body[field] !== undefined && body[field] !== null) {
        updateData[field] = body[field];
      }
    });

    // Handle social_links separately
    if (body.social_links) {
      // Validate social links format if needed
      if (typeof body.social_links !== "object") {
        return NextResponse.json(
          { error: "Invalid social links format" },
          { status: 400 }
        );
      }

      updateData.social_links = JSON.stringify(body.social_links);
    }

    // If no valid fields to update, return early
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    connection = await createConnection();

    // Check if the username is already taken
    if (updateData.username) {
      const [existingUser] = await connection.query(
        "SELECT * FROM users WHERE username = ? AND id != ?",
        [updateData.username, userid]
      );

      if (existingUser.length > 0) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    // Create SET clause for SQL query
    const setClause = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updateData)];

    // Add the WHERE clause values
    values.push(userid);

    const query = `
      UPDATE users 
      SET ${setClause}
      WHERE id = ?
    `;

    const [result] = await connection.execute(query, values);

    // Check if any rows were affected
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      updated: updateData,
    });
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
