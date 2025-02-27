export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function GET(request: Request) {
  //navigation ke liye
  let connection;

  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (userId == null || userId == undefined) {
      return NextResponse.json({ error: "No user id found" }, { status: 500 });
    }

    connection = await createConnection();

    const [partners] = await connection.query(
      "SELECT * FROM partners WHERE creator_id = ?",
      [userId]
    );

    if (partners.length === 0) {
      return NextResponse.json({ partners: null });
    }

    return NextResponse.json({ partners: partners[0] });
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
    const body = await request.json();
    const session = await auth();
    const userId = session?.user?.id;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No user id found" }, { status: 500 });
    }

    // Validation functions
    const validateUsername = (username: string) => {
      if (!username || typeof username !== "string") {
        return "Username is required";
      }
      if (username.trim() === "") {
        return "Username cannot be empty";
      }
      // Only allow letters and numbers, length between 3 and 30 characters
      if (!/^[a-zA-Z0-9]{2,30}$/.test(username)) {
        return "Username must be 2-30 characters long and can only contain letters and numbers";
      }
      return null;
    };

    const validateName = (name: string) => {
      if (!name || typeof name !== "string") {
        return "Name is required";
      }
      if (name.trim() === "") {
        return "Name cannot be empty";
      }
      // Allow letters, numbers and spaces, length between 2 and 50 characters
      if (!/^[a-zA-Z0-9\s]{2,30}$/.test(name)) {
        return "Name must be 2-30 characters long and can only contain letters, numbers, and spaces";
      }
      return null;
    };

    const validateEmail = (email: string) => {
      if (!email || typeof email !== "string") {
        return "Email is required";
      }
      if (email.trim() === "") {
        return "Email cannot be empty";
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return "Please provide a valid email address";
      }
      if (email.length > 255) {
        return "Email must not exceed 255 characters";
      }
      return null;
    };

    // Perform validations
    const usernameError = validateUsername(body.username);
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 });
    }

    const nameError = validateName(body.name);
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    const emailError = validateEmail(body.email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    let finalUsername = body.username;
    let count = 1;

    // Extract only the allowed fields from the request body
    const allowedFields = [
      "name",
      "email",
      "description",
      "bio",
      "industry_name",
      "profile_photo_url",
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
      // Convert social_links object to JSON string for MySQL storage
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

    // Generate unique username
    while (true) {
      const [existingUsername] = await connection.query(
        "SELECT username FROM partners WHERE username = ? AND id != ?",
        [finalUsername, userId]
      );

      if (existingUsername.length === 0) break;
      finalUsername = `${body.username}${count}`;
      count++;
    }

    // Add the creator_id (user_id)
    updateData.creator_id = userId;
    updateData.username = finalUsername;

    // Check if a partner already exists with the same creator_id
    const [existingPartner] = await connection.query(
      "SELECT * FROM partners WHERE creator_id = ?",
      [userId]
    );

    if (existingPartner.length > 0) {
      // If the partner exists, update the profile
      const columns = Object.keys(updateData).join(", ");
      const placeholders = Object.keys(updateData)
        .map(() => "?")
        .join(", ");
      const values = [...Object.values(updateData)];

      const query = `
        UPDATE partners 
        SET ${Object.keys(updateData)
          .map((key) => `${key} = ?`)
          .join(", ")} 
        WHERE creator_id = ?
      `;

      const [updateResult] = await connection.execute(query, [
        ...values,
        userId,
      ]);

      // Check if any rows were affected
      if ((updateResult as any).affectedRows === 0) {
        return NextResponse.json(
          { error: "No updates were made" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Partner profile updated successfully",
        updated: updateData,
      });
    } else {
      // If no existing partner, insert a new partner
      const columns = Object.keys(updateData).join(", ");
      const placeholders = Object.keys(updateData)
        .map(() => "?")
        .join(", ");
      const values = [...Object.values(updateData)];

      const query = `
        INSERT INTO partners (${columns})
        VALUES (${placeholders})
      `;

      const [insertResult] = await connection.execute(query, values);

      if ((insertResult as any).affectedRows === 0) {
        return NextResponse.json(
          { error: "Partner creation failed" },
          { status: 500 }
        );
      }

      //update is_partner to true in users table
      const [updateUser] = await connection.execute(
        "UPDATE users SET is_partner = ? WHERE id = ?",
        [1, userId]
      );

      if ((updateUser as any).affectedRows === 0) {
        return NextResponse.json({ error: "User not updated or found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Partner added successfully",
        updated: updateData,
      });
    }
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        error: "Internal server error"  + error,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
